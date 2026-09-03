'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { Link, RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/shared/utils'
import classes from './rich-text-editor.module.css'

export type RichTextEditorProps = {
    value: string
    onChange?: (value: string) => void
    placeholder?: string
    editable?: boolean
    bordered?: boolean
    className?: string
    minHeight?: number | string
    onKeyDown?: (event: KeyboardEvent) => void
}

export const RichTextEditor = ({
    value,
    onChange,
    placeholder,
    editable = true,
    bordered = false,
    className,
    minHeight,
    onKeyDown
}: RichTextEditorProps) => {
    const onChangeRef = useRef(onChange)
    const onKeyDownRef = useRef(onKeyDown)
    onChangeRef.current = onChange
    onKeyDownRef.current = onKeyDown

    const editor = useEditor({
        immediatelyRender: false,
        shouldRerenderOnTransaction: true,
        editable,
        extensions: [
            StarterKit.configure({ link: false }),
            Link,
            Placeholder.configure({
                placeholder: placeholder ?? ''
            })
        ],
        content: value || '',
        onUpdate: ({ editor: current }) => {
            onChangeRef.current?.(current.getHTML())
        },
        editorProps: {
            handleKeyDown: (_view, event) => {
                onKeyDownRef.current?.(event)
                return false
            }
        }
    })

    useEffect(() => {
        if (!editor) return
        const current = editor.getHTML()
        const next = value || ''
        if (next !== current) {
            editor.commands.setContent(next, { emitUpdate: false })
        }
    }, [editor, value])

    useEffect(() => {
        if (!editor) return
        editor.setEditable(editable)
    }, [editor, editable])

    const style = {
        '--rte-min-height': typeof minHeight === 'number' ? `${minHeight}px` : minHeight
    } as CSSProperties

    return (
        <MantineRichTextEditor
            editor={editor}
            variant="subtle"
            className={cn(classes.root, bordered && classes.bordered, className)}
            style={style}
        >
            {editor && editable && (
                <>
                    <BubbleMenu editor={editor}>
                        <MantineRichTextEditor.ControlsGroup className={classes.menu}>
                            <MantineRichTextEditor.Bold />
                            <MantineRichTextEditor.Italic />
                            <MantineRichTextEditor.Underline />
                            <MantineRichTextEditor.Strikethrough />
                            <MantineRichTextEditor.Code />
                            <MantineRichTextEditor.Link />
                        </MantineRichTextEditor.ControlsGroup>
                    </BubbleMenu>
                    <FloatingMenu editor={editor}>
                        <MantineRichTextEditor.ControlsGroup className={classes.menu}>
                            <MantineRichTextEditor.H1 />
                            <MantineRichTextEditor.H2 />
                            <MantineRichTextEditor.BulletList />
                            <MantineRichTextEditor.OrderedList />
                        </MantineRichTextEditor.ControlsGroup>
                    </FloatingMenu>
                </>
            )}
            <MantineRichTextEditor.Content />
        </MantineRichTextEditor>
    )
}

RichTextEditor.displayName = 'RichTextEditor'
