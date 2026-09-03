'use client'

import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import { Link, RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap'
import { useEditor, type Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react'
import { cn } from '@/shared/utils'
import classes from './rich-text-editor.module.css'

export type RichTextEditorProps = {
    value: string
    onChange?: (value: string) => void
    placeholder?: string
    editable?: boolean
    bordered?: boolean
    canvas?: boolean
    className?: string
    minHeight?: number | string
    onKeyDown?: (event: KeyboardEvent) => void
    onFocus?: () => void
    onBlur?: () => void
}

const ALIGNMENTS = [
    { value: 'left', label: 'Align left', Icon: AlignLeft },
    { value: 'center', label: 'Align center', Icon: AlignCenter },
    { value: 'right', label: 'Align right', Icon: AlignRight },
    { value: 'justify', label: 'Align justify', Icon: AlignJustify }
] as const

const setAlign = (editor: Editor, alignment: (typeof ALIGNMENTS)[number]['value']) => {
    editor.chain().focus().run()
    editor.commands.setTextAlign(alignment)
}

export const RichTextEditor = ({
    value,
    onChange,
    placeholder,
    editable = true,
    bordered = false,
    canvas = false,
    className,
    minHeight,
    onKeyDown,
    onFocus,
    onBlur
}: RichTextEditorProps) => {
    const onChangeRef = useRef(onChange)
    const onKeyDownRef = useRef(onKeyDown)
    const onFocusRef = useRef(onFocus)
    const onBlurRef = useRef(onBlur)
    onChangeRef.current = onChange
    onKeyDownRef.current = onKeyDown
    onFocusRef.current = onFocus
    onBlurRef.current = onBlur

    const extensions = useMemo(
        () => [
            StarterKit.configure({ link: false }),
            Link,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify']
            }),
            Placeholder.configure({
                placeholder: placeholder ?? ''
            })
        ],
        [placeholder]
    )

    const editor = useEditor(
        {
            immediatelyRender: false,
            shouldRerenderOnTransaction: true,
            editable,
            extensions,
            content: value || '',
            onUpdate: ({ editor: current }) => {
                onChangeRef.current?.(current.getHTML())
            },
            onFocus: () => {
                onFocusRef.current?.()
            },
            onBlur: () => {
                onBlurRef.current?.()
            },
            editorProps: {
                handleKeyDown: (_view, event) => {
                    onKeyDownRef.current?.(event)
                    return false
                }
            }
        },
        [extensions]
    )

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
            className={cn(classes.root, bordered && classes.bordered, canvas && classes.canvas, className)}
            style={style}
        >
            {editor && editable && (
                <BubbleMenu editor={editor}>
                    <MantineRichTextEditor.ControlsGroup className={classes.menu}>
                        <MantineRichTextEditor.Bold />
                        <MantineRichTextEditor.Italic />
                        <MantineRichTextEditor.Underline />
                        <MantineRichTextEditor.Strikethrough />
                        <MantineRichTextEditor.Code />
                        <MantineRichTextEditor.Link />
                        <MantineRichTextEditor.H1 />
                        <MantineRichTextEditor.H2 />
                        <MantineRichTextEditor.BulletList />
                        <MantineRichTextEditor.OrderedList />
                        {ALIGNMENTS.map(({ value: align, label, Icon }) => (
                            <MantineRichTextEditor.Control
                                key={align}
                                active={editor.isActive({ textAlign: align })}
                                aria-label={label}
                                title={label}
                                onClick={() => setAlign(editor, align)}
                            >
                                <Icon size={16} strokeWidth={2} />
                            </MantineRichTextEditor.Control>
                        ))}
                    </MantineRichTextEditor.ControlsGroup>
                </BubbleMenu>
            )}
            <MantineRichTextEditor.Content />
        </MantineRichTextEditor>
    )
}

RichTextEditor.displayName = 'RichTextEditor'
