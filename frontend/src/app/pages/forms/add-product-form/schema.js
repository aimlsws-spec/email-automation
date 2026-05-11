// Import Dependencies
import * as Yup from 'yup'

// Local Imports
import { isDeltaNotEmpty } from 'utils/quillUtils';

// ----------------------------------------------------------------------

export const generalSchema = Yup.object().shape({
    title: Yup.string()
        .trim()
        .min(2, 'Product Title Too Short!')
        .max(50, 'Product Title Too Long!')
        .required('Product Title Required'),
    sku: Yup.string()
        .trim()
        .matches(/^[A-Z0-9]+$/, 'Invalid SKU')
        .required('Product SKU Required'),
    price: Yup.number('Value must be number')
        .transform((val) => isNaN(val) ? null : val)
        .positive('Price Must Be Positive')
        .required('Product Price Required'),
    category_id: Yup.string()
        .required('Please Select Product Category'),
    brand_id: Yup.string()
        .required('Please Select Product Brand'),
    selling_type: Yup.string()
        .required('Please Select Selling Type'),
    inStock: Yup.boolean()
        .required('Required'),
})

export const descriptionSchema = Yup.object().shape({
    short_description: Yup.string()
        .trim()
        .max(128, 'Short Product Description Too Long!')
        .required('Short Product Description Required'),
    description: Yup.object()
        .required('Product Description Required')
        .test("notEmpty", "Content Can't be empty", isDeltaNotEmpty),
    meta_title: Yup.string()
        .trim()
        .max(60, 'Meta Title Too Long!')
        .required('Meta Title Required'),
    meta_description: Yup.string()
        .trim()
        .max(160, 'Meta Description Too Long!')
        .required('Meta Description Required'),
    meta_keywords: Yup.array().of(Yup.string()).min(1).max(10).required('Meta Keywords Required'),
});

export const imageSchema = Yup.object().shape({
    cover: Yup.mixed().nullable()
        .required("You need to provide a file")
        .test("fileSize", "Max file size should be 4MB", value => value && value.size <= 4194304),
    gallery: Yup.array().of(Yup.mixed().nullable()).max(10),
})
