# Portfolio Deployment (Ansible)

Deploys the SIGNAL//DESK portfolio to the shared frontend VM (168.138.13.45).

## Architecture

The portfolio runs as a Docker container on the shared `mailhero-net` network
**without published ports**. The `email-tester-saas` frontend nginx owns host
ports 80/443 and proxies by hostname:

| Hostname                    | Container                   | Deployed by          |
|-----------------------------|-----------------------------|----------------------|
| `lucasboglione.com`         | `tree-js-portfolio`         | `deploy.yml`         |
| `staging.lucasboglione.com` | `tree-js-portfolio-staging` | `deploy-staging.yml` |

TLS is terminated by the email-tester-saas nginx using a Cloudflare Origin
Certificate for `lucasboglione.com`, written by `deploy.yml` into
`/opt/email-tester-saas-frontend/certs/`.

## One-time setup

1. **Vault:** `cp group_vars/all/vault.yml.example group_vars/all/vault.yml`,
   fill in values, then `ansible-vault encrypt group_vars/all/vault.yml`.
   Put the vault password in `.vault_pass` (gitignored).
2. **GitHub repo secrets:** `DEPLOY_SSH_KEY` (private key for ubuntu@VM) and
   `ANSIBLE_VAULT_PASSWORD`. Create a `production` environment for the deploy job.
3. **DNS (Cloudflare):** A-records for `lucasboglione.com`, `www`, and
   `staging` → 168.138.13.45 (proxied).
4. **Routing:** the `lucasboglione.com` server blocks live in
   `email-tester-saas/frontend/nginx.conf`. Run the portfolio **production
   deploy first** (it writes the certs), then rebuild/redeploy the
   email-tester-saas frontend — its nginx fails to start if the cert files
   referenced in its config are missing.

## Manual deploys

```bash
# Staging (image tag "main" is pushed on every merge to main)
ansible-playbook deploy-staging.yml -e "app_version=main"

# Production
ansible-playbook deploy.yml -e "app_version=1.0.0"
```

In CI, staging deploys on every push to main; production deploys on `v*` tags
or manual workflow dispatch (which also creates the tag).
