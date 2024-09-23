// src/components/RichTextEditor.js
import React, { useMemo, useCallback } from 'react';
import { Slate, Editable, withReact, useSlate, ReactEditor } from 'slate-react';
import { createEditor, Transforms, Editor, Element as SlateElement } from 'slate';
import { withHistory } from 'slate-history';
import { Button } from './Button'; // Assume you have a Button component
import { CodeIcon } from '@heroicons/react/solid'; // Using Heroicons for the Attach Code button
import CodeAttachmentBubble from './CodeAttachmentBubble';

const RichTextEditor = ({ value, onChange, addCodeAttachment }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Define how elements are rendered
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <div className="flex mb-2">
        <Toolbar>
          <InsertCodeButton onInsert={() => addCodeAttachment()} />
        </Toolbar>
      </div>
      <Editable
        renderElement={renderElement}
        placeholder="Type your message..."
        spellCheck
        autoFocus
        className="w-full p-2 border rounded-lg resize-none dark:bg-zinc-800 dark:text-gray-200"
      />
    </Slate>
  );
};

const Toolbar = ({ children }) => {
  return <div className="toolbar">{children}</div>;
};

const InsertCodeButton = ({ onInsert }) => {
  const editor = useSlate();
  return (
    <Button onMouseDown={(event) => {
      event.preventDefault();
      onInsert();
    }}>
      <CodeIcon className="h-5 w-5" />
    </Button>
  );
};

const CodeElement = ({ attributes, children, element }) => {
  return (
    <span {...attributes} contentEditable={false}>
      <CodeAttachmentBubble attachment={element} />
      {children}
    </span>
  );
};

const DefaultElement = (props) => {
  return <span {...props.attributes}>{props.children}</span>;
};

export default RichTextEditor;
