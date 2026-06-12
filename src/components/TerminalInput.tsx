import { useRef, useState, type FormEvent } from 'react';

/**
 * Keyboard-accessible terminal prompt. Pure input component —
 * command execution lives in the parent (MainTerminalScreen).
 */
export function TerminalInput({
  onCommand,
  autoFocus = false,
}: {
  onCommand: (input: string) => void;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onCommand(value);
    setValue('');
  };

  return (
    <form className="terminal-input-row" onSubmit={submit}>
      <label htmlFor="terminal-input" className="terminal-prompt">
        operator@signal-desk:~$
      </label>
      <input
        id="terminal-input"
        ref={inputRef}
        className="terminal-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        autoFocus={autoFocus}
        placeholder="type 'help'"
        aria-label="Terminal command input"
      />
    </form>
  );
}
