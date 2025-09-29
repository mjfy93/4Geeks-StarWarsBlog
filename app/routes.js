export default [
    {path: '/', file: 'routes/_index.jsx'},
    { path: '/favorites', file: 'routes/favorites.jsx' },
    { path: '/:category', file: 'routes/$category.jsx' },
    { path: '/:category/:subcategory', file: 'routes/$category.$subcategory.jsx' }

]