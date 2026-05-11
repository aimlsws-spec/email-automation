import FormsIcon from 'assets/dualicons/forms.svg?react'
import InputIcon from 'assets/nav-icons/input.svg?react'
import InputGroupIcon from 'assets/nav-icons/input-group.svg?react'
import InputMaskIcon from 'assets/nav-icons/input-mask.svg?react'
import IdIcon from 'assets/nav-icons/id.svg?react'
import BoxAddIcon from 'assets/nav-icons/box-add.svg?react'
import DocumentAddIcon from 'assets/nav-icons/document-add.svg?react'
import CheckboxIcon from 'assets/nav-icons/checkbox.svg?react'
import RadioIcon from 'assets/nav-icons/radio.svg?react'
import SwitchIcon from 'assets/nav-icons/switch.svg?react'
import SwapIcon from 'assets/nav-icons/swap.svg?react'
import TextareaIcon from 'assets/nav-icons/textarea.svg?react'
import SelectIcon from 'assets/nav-icons/select.svg?react'
import CalendarIcon from 'assets/nav-icons/calendar.svg?react'
import RangeIcon from 'assets/nav-icons/range.svg?react'
import ValidationIcon from 'assets/nav-icons/validation.svg?react'
import ActtachmentIcon from 'assets/nav-icons/attachment.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM, NAV_TYPE_DIVIDER } from 'constants/app.constant'

const ROOT_FORMS = '/forms';

const path = (root, item) => `${root}${item}`;

export const forms = {
    id: 'forms',
    type: NAV_TYPE_ROOT,
    path: 'forms',
    title: 'Forms',
    transKey: 'nav.forms.forms',
    Icon: FormsIcon,
    childs: [
        {
            id: 'forms.ekyc-form',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/ekyc-form'),
            title: 'eKYC Form',
            transKey: 'nav.forms.ekyc-form',
            Icon: IdIcon
        },
        {
            id: 'forms.add-product-form',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/add-product-form'),
            title: 'Add Product Form',
            transKey: 'nav.forms.add-product-form',
            Icon: BoxAddIcon
        },
        {
            id: 'forms.new-post-form',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/new-post-form'),
            title: 'New Post Form',
            transKey: 'nav.forms.new-post-form',
            Icon: DocumentAddIcon
        },
        {
            id: 'pages.divide-2',
            type: NAV_TYPE_DIVIDER
        },
        {
            id: 'forms.input',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/input'),
            title: 'Form Input',
            transKey: 'nav.forms.input',
            Icon: InputIcon
        },
        {
            id: 'forms.input-group',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/input-group'),
            title: 'Input Group',
            transKey: 'nav.forms.input-group',
            Icon: InputGroupIcon
        },
        {
            id: 'forms.input-mask',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/input-mask'),
            title: 'Input Mask',
            transKey: 'nav.forms.input-mask',
            Icon: InputMaskIcon
        },
        {
            id: 'forms.checkbox',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/checkbox'),
            title: 'Checkbox',
            transKey: 'nav.forms.checkbox',
            Icon: CheckboxIcon
        },
        {
            id: 'forms.radio',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/radio'),
            title: 'Radio',
            transKey: 'nav.forms.radio',
            Icon: RadioIcon
        },
        {
            id: 'forms.switch',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/switch'),
            title: 'Switch',
            transKey: 'nav.forms.switch',
            Icon: SwitchIcon
        },
        {
            id: 'forms.swap',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/swap'),
            title: 'Swap',
            transKey: 'nav.forms.swap',
            Icon: SwapIcon
        },
        {
            id: 'forms.textarea',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/textarea'),
            title: 'Textarea',
            transKey: 'nav.forms.textarea',
            Icon: TextareaIcon
        },
        {
            id: 'forms.select',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/select'),
            title: 'Select',
            transKey: 'nav.forms.select',
            Icon: SelectIcon
        },
        {
            id: 'forms.range',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/range'),
            title: 'Range',
            transKey: 'nav.forms.range',
            Icon: RangeIcon
        },
        {
            id: 'forms.listbox',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/listbox'),
            title: 'Listbox',
            transKey: 'nav.forms.listbox',
            Icon: SelectIcon
        },
        {
            id: 'forms.autocomplete',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/autocomplete'),
            title: 'Autocomplete',
            transKey: 'nav.forms.autocomplete',
            Icon: SelectIcon
        },
        {
            id: 'forms.file-upload',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/file-upload'),
            title: 'File Upload',
            transKey: 'nav.forms.file-upload',
            Icon: ActtachmentIcon
        },
        {
            id: 'forms.form-validation',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/form-validation'),
            title: 'Form Validation',
            transKey: 'nav.forms.form-validation',
            Icon: ValidationIcon
        },
        {
            id: 'forms.text-editor',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/text-editor'),
            title: 'text-editor',
            transKey: 'nav.forms.text-editor',
            Icon: TextareaIcon
        },
        {
            id: 'forms.filepond',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/filepond'),
            title: 'Filepond',
            transKey: 'nav.forms.filepond',
            Icon: ActtachmentIcon
        },
        {
            id: 'forms.datepicker',
            type: NAV_TYPE_ITEM,
            path: path(ROOT_FORMS, '/datepicker'),
            title: 'Datepicker',
            transKey: 'nav.forms.datepicker',
            Icon: CalendarIcon
        }
    ]
}
