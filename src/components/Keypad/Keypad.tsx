import { KeyButton } from './KeyButton';
import { Delete, RotateCcw } from 'lucide-react';

interface KeypadProps {
  onInsertText: (text: string) => void;
  onClear: () => void;
  onAllClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onEvaluate: () => void;
}

export function Keypad({
  onInsertText,
  onClear,
  onAllClear,
  onBackspace,
  onToggleSign,
  onEvaluate
}: KeypadProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
      {/* Row 1 */}
      <KeyButton
        variant="clear"
        label="AC"
        onClick={onAllClear}
        title="All Clear"
      />
      <KeyButton
        variant="action"
        label="C"
        onClick={onClear}
        title="Clear Entry"
      />
      <KeyButton
        variant="action"
        label={<Delete className="w-4 h-4 mx-auto" />}
        onClick={onBackspace}
        title="Backspace"
      />
      <KeyButton
        variant="action"
        label="%"
        onClick={() => onInsertText('%')}
        title="Percentage"
      />
      <KeyButton
        variant="operator"
        label="÷"
        onClick={() => onInsertText(' / ')}
      />

      {/* Row 2 */}
      <KeyButton
        variant="action"
        label="("
        onClick={() => onInsertText('(')}
      />
      <KeyButton
        variant="number"
        label="7"
        onClick={() => onInsertText('7')}
      />
      <KeyButton
        variant="number"
        label="8"
        onClick={() => onInsertText('8')}
      />
      <KeyButton
        variant="number"
        label="9"
        onClick={() => onInsertText('9')}
      />
      <KeyButton
        variant="operator"
        label="×"
        onClick={() => onInsertText(' * ')}
      />

      {/* Row 3 */}
      <KeyButton
        variant="action"
        label=")"
        onClick={() => onInsertText(')')}
      />
      <KeyButton
        variant="number"
        label="4"
        onClick={() => onInsertText('4')}
      />
      <KeyButton
        variant="number"
        label="5"
        onClick={() => onInsertText('5')}
      />
      <KeyButton
        variant="number"
        label="6"
        onClick={() => onInsertText('6')}
      />
      <KeyButton
        variant="operator"
        label="−"
        onClick={() => onInsertText(' - ')}
      />

      {/* Row 4 */}
      <KeyButton
        variant="action"
        label="±"
        onClick={onToggleSign}
        title="Positive/Negative toggle"
      />
      <KeyButton
        variant="number"
        label="1"
        onClick={() => onInsertText('1')}
      />
      <KeyButton
        variant="number"
        label="2"
        onClick={() => onInsertText('2')}
      />
      <KeyButton
        variant="number"
        label="3"
        onClick={() => onInsertText('3')}
      />
      <KeyButton
        variant="operator"
        label="+"
        onClick={() => onInsertText(' + ')}
      />

      {/* Row 5 */}
      <KeyButton
        variant="action"
        label="Ans"
        onClick={() => onInsertText('ans')}
        title="Previous Result"
      />
      <KeyButton
        variant="number"
        label="0"
        onClick={() => onInsertText('0')}
      />
      <KeyButton
        variant="number"
        label="."
        onClick={() => onInsertText('.')}
      />
      <KeyButton
        variant="equals"
        label="="
        onClick={onEvaluate}
        className="col-span-2 text-lg"
      />
    </div>
  );
}
