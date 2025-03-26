//types
export type MarkdownProps = { value: string };
//components
import MarkdownFrame from 'markdown-to-jsx';

/**
 * Markdown Format Component (Main)
 */
export default function Markdown({ value }: MarkdownProps) {
  return (
    //@ts-ignore - Type 'string' is not assignable to type 'ReactNode'.
    <MarkdownFrame children={value} />
  );
};