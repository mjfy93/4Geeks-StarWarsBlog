export default [
    {path: '/', file: 'routes/_index.jsx'},
    { path: '/:category', file: 'routes/$category.jsx' },
    { path: '/:category/:subcategory', file: 'routes/$category.$subcategory.jsx' }

]