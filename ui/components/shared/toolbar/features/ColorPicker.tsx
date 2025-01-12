import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baseline } from 'lucide-react';
import { EditorWithExtensions } from '../types/editor';
import { editorActions } from '../actions/editor';

export const colors = [
  { value: '', color: 'transparent', border: true, label: 'Default' },
  { value: '#000000', color: '#000000', label: 'Black' },
  { value: '#4A5568', color: '#4A5568', label: 'Gray' },
  { value: '#718096', color: '#718096', label: 'Cool Gray' },
  { value: '#E53E3E', color: '#E53E3E', label: 'Red' },
  { value: '#DD6B20', color: '#DD6B20', label: 'Orange' },
  { value: '#D69E2E', color: '#D69E2E', label: 'Yellow' },
  { value: '#38A169', color: '#38A169', label: 'Green' },
  { value: '#3182CE', color: '#3182CE', label: 'Blue' },
  { value: '#805AD5', color: '#805AD5', label: 'Purple' },
  { value: '#D53F8C', color: '#D53F8C', label: 'Pink' },
];

interface ColorPickerProps {
  editor?: EditorWithExtensions;
}

export const ColorPicker = ({ editor }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState('');

  // Update current color when selection changes
  useEffect(() => {
    if (!editor) return;

    const updateColor = () => {
      const color = editorActions.getTextColor(editor);
      setCurrentColor(color);
    };

    // Update initially
    updateColor();

    // Update on selection change
    editor.on('selectionUpdate', updateColor);
    editor.on('transaction', updateColor);

    return () => {
      editor.off('selectionUpdate', updateColor);
      editor.off('transaction', updateColor);
    };
  }, [editor]);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-1 rounded-md cursor-pointer hover:bg-light-primary dark:hover:bg-dark-primary hst:rounded-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Baseline
          style={{
            color: currentColor || 'currentColor',
            opacity: currentColor ? 1 : 0.7,
          }}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1 bg-light-secondary dark:bg-[#111111] rounded-md border border-[#d0d0d0] dark:border-[#1c1c1c] shadow-lg p-2 hst:rounded-none"
          >
            <div className="grid grid-cols-6 gap-1" style={{ width: '144px' }}>
              {colors.map((color) => (
                <button
                  key={color.value}
                  className={`appearance-none w-5 h-5 rounded-full flex items-center justify-center transition-transform focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none active:outline-none hover:scale-125`}
                  onClick={() => {
                    editorActions.setTextColor(editor, color.value);
                    setCurrentColor(color.value);
                    setIsOpen(false);
                  }}
                  aria-label={`Set text color to ${color.label}`}
                  type="button"
                >
                  <div
                    className={`w-4 h-4 rounded-full ${color.border ? 'border-2 border-[#d0d0d0] dark:border-[#1c1c1c]' : ''}`}
                    style={{ backgroundColor: color.color }}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
