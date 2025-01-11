import { Editor } from '@tiptap/react';
import { LucideIcon } from 'lucide-react';
import { EditorFeatures } from './types/editor';
import { cn, calculateElementSpacing } from '@/lib/utils';
import Tooltip from '../Tooltip';

interface ToolbarProps {
  features: EditorFeatures;
  content: Editor | null;
  className?: string;
  spacing?: number[];
}

const Toolbar = ({
  features,
  content,
  className,
  spacing = [
    0.8, // back
    0.8, // save
    2, // export

    0.8, // undo
    1.5, // redo

    1.2, // type

    0.8, // bold
    0.8, // italic
    0.8, // underline
    2.5, // color

    0.8, // left
    0.8, // center
    0.8, // right
    2.5, // justify

    0.8, // ordered list
    0.8, // unordered list
    0.8, // horizontal line
  ],
}: ToolbarProps) => {
  const featureEntries = Object.entries(features);
  const margins = calculateElementSpacing(
    featureEntries.length,
    spacing,
    'rem',
  );

  return (
    <div className={cn('flex items-center justify-center w-full', className)}>
      <div className="flex items-center justify-center w-full bg-light-secondary dark:bg-dark-secondary rounded-[0.625rem] hst:rounded-none border border-[#D0D0D0] dark:border-dark-200 px-[1.188rem] py-[0.562rem]">
        {featureEntries.map(([key, feature], index) => {
          // If it's a spacer (null), show a divider
          if (feature === null) {
            return (
              <div
                key={key}
                className="w-px h-6 bg-border dark:bg-dark-200"
                style={{ marginRight: margins[index] }}
              />
            );
          }

          // If it has a custom component, use it
          if (feature.component) {
            return (
              <div
                key={key}
                className="flex items-center"
                style={{ marginRight: margins[index] }}
              >
                {feature.component()}
              </div>
            );
          }

          // Standard feature with icon
          const Icon = feature.icon;
          return (
            <Tooltip key={key} text={feature.label} spacing="1.2rem">
              <div
                className="flex items-center justify-center w-[1.375rem] h-[1.375rem] text-black dark:text-white hover:text-[#24A0ED] dark:hover:text-[#24A0ED] hst:hover:text-hst-accent transition-colors"
                style={{ marginRight: margins[index] }}
                aria-label={feature.tooltip}
                onClick={() => feature.action(content)}
              >
                <Icon className="w-full h-full" />
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default Toolbar;
