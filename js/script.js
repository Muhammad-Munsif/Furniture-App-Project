
(function () {
    'use strict';

    // ============================================================
    // 1. PRODUCT DATA WITH STOCK
    // ============================================================
    const FEATURED = [
        { id: 1, name: 'Luxury Velvet Sofa', price: 899.99, oldPrice: 1299.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Elegant velvet with premium cushioning.', rating: 4.8, reviewCount: 124, isNew: true, stock: 15, colors: ['#4a5568', '#2d3748', '#e2e8f0', '#c53030'], sizes: ['2-Seat', '3-Seat', 'L-Shape'], category: 'living' },
        { id: 2, name: 'Modern Armchair', price: 349.99, oldPrice: 449.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ergonomic design with stylish fabric.', rating: 4.6, reviewCount: 89, stock: 3, colors: ['#2d3748', '#4a5568', '#d69e2e'], sizes: ['Standard', 'Wide'], category: 'living' },
        { id: 3, name: 'Oak Dining Table', price: 599.99, oldPrice: 799.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Solid oak, extendable for gatherings.', rating: 4.9, reviewCount: 67, isNew: true, stock: 8, colors: ['#d69e2e', '#4a5568'], sizes: ['6-Seat', '8-Seat', '10-Seat'], category: 'dining' },
        { id: 4, name: 'Minimalist Bed Frame', price: 749.99, oldPrice: 999.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Clean lines, sturdy construction.', rating: 4.7, reviewCount: 156, stock: 0, colors: ['#2d3748', '#4a5568'], sizes: ['Queen', 'King'], category: 'bedroom' }
    ];

    const CATEGORY_PRODUCTS = {
        living: [
            { id: 101, name: 'Sectional Sofa', price: 1299.99, oldPrice: 1699.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Spacious L-shaped sectional.', rating: 4.8, reviewCount: 45, stock: 5, colors: ['#4a5568', '#2d3748'], sizes: ['L-Shape', 'U-Shape'], category: 'living' },
            { id: 102, name: 'Coffee Table', price: 299.99, oldPrice: 399.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Minimalist wood and glass.', rating: 4.5, reviewCount: 32, stock: 12, colors: ['#d69e2e', '#4a5568'], sizes: ['Small', 'Large'], category: 'living' },
            { id: 103, name: 'TV Stand', price: 449.99, oldPrice: 599.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern media console.', rating: 4.6, reviewCount: 28, stock: 2, colors: ['#2d3748', '#4a5568'], sizes: ['55"', '65"'], category: 'living' },
            { id: 104, name: 'Accent Chair', price: 249.99, oldPrice: 329.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Mid-century modern style.', rating: 4.7, reviewCount: 51, stock: 7, colors: ['#c53030', '#d69e2e', '#38a169'], sizes: ['Standard'], category: 'living' },
            { id: 105, name: 'Rug', price: 189.99, oldPrice: 259.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Wool blend, geometric pattern.', rating: 4.4, reviewCount: 19, stock: 20, colors: ['#4a5568', '#d69e2e'], sizes: ['5x8', '8x10'], category: 'living' },
            { id: 106, name: 'Floor Lamp', price: 159.99, oldPrice: 219.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable arc lamp.', rating: 4.6, reviewCount: 37, stock: 15, colors: ['#2d3748', '#d69e2e'], sizes: ['Standard'], category: 'lighting' },
            { id: 107, name: 'Bookshelf', price: 399.99, oldPrice: 549.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '5-tier open shelving.', rating: 4.8, reviewCount: 42, stock: 4, colors: ['#4a5568', '#2d3748'], sizes: ['5-Tier', '7-Tier'], category: 'living' },
            { id: 108, name: 'Ottoman', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Tufted storage ottoman.', rating: 4.5, reviewCount: 24, stock: 9, colors: ['#c53030', '#4a5568'], sizes: ['Small', 'Large'], category: 'living' },
            { id: 109, name: 'Wall Art', price: 129.99, oldPrice: 179.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Abstract canvas set.', rating: 4.3, reviewCount: 15, stock: 25, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Set of 2', 'Set of 3'], category: 'decor' },
            { id: 110, name: 'Pouf', price: 89.99, oldPrice: 119.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Knitted cotton pouf.', rating: 4.7, reviewCount: 33, stock: 18, colors: ['#d69e2e', '#4a5568'], sizes: ['Standard'], category: 'living' }
        ],
        bedroom: [
            { id: 201, name: 'King Bed Frame', price: 999.99, oldPrice: 1399.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Upholstered headboard.', rating: 4.9, reviewCount: 78, stock: 6, colors: ['#4a5568', '#2d3748'], sizes: ['Queen', 'King'], category: 'bedroom' },
            { id: 202, name: 'Nightstand', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Solid wood, two drawers.', rating: 4.6, reviewCount: 41, stock: 14, colors: ['#d69e2e', '#4a5568'], sizes: ['Standard'], category: 'bedroom' },
            { id: 203, name: 'Dresser', price: 549.99, oldPrice: 749.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '6-drawer modern dresser.', rating: 4.7, reviewCount: 36, stock: 3, colors: ['#2d3748', '#d69e2e'], sizes: ['6-Drawer', '8-Drawer'], category: 'bedroom' },
            { id: 204, name: 'Mirror', price: 129.99, oldPrice: 179.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Floor-length arched mirror.', rating: 4.8, reviewCount: 52, stock: 11, colors: ['#d69e2e', '#e2e8f0'], sizes: ['Full', 'Standard'], category: 'decor' },
            { id: 205, name: 'Bedside Lamp', price: 79.99, oldPrice: 109.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Dimmable ceramic lamp.', rating: 4.5, reviewCount: 27, stock: 22, colors: ['#e2e8f0', '#4a5568'], sizes: ['Standard'], category: 'lighting' },
            { id: 206, name: 'Wardrobe', price: 799.99, oldPrice: 1099.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Sliding door wardrobe.', rating: 4.6, reviewCount: 31, stock: 4, colors: ['#2d3748', '#d69e2e'], sizes: ['2-Door', '3-Door'], category: 'bedroom' },
            { id: 207, name: 'Bench', price: 249.99, oldPrice: 349.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Upholstered bench with storage.', rating: 4.7, reviewCount: 22, stock: 7, colors: ['#c53030', '#4a5568'], sizes: ['Standard'], category: 'bedroom' },
            { id: 208, name: 'Rug', price: 159.99, oldPrice: 219.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Plush shag rug.', rating: 4.4, reviewCount: 18, stock: 16, colors: ['#e2e8f0', '#d69e2e'], sizes: ['4x6', '5x8'], category: 'decor' },
            { id: 209, name: 'Desk', price: 399.99, oldPrice: 549.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Compact writing desk.', rating: 4.5, reviewCount: 29, stock: 8, colors: ['#4a5568', '#d69e2e'], sizes: ['Standard', 'Large'], category: 'office' },
            { id: 210, name: 'Pillow Set', price: 89.99, oldPrice: 119.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 4 decorative pillows.', rating: 4.8, reviewCount: 47, stock: 30, colors: ['#c53030', '#4a5568', '#d69e2e'], sizes: ['Set of 4'], category: 'bedroom' }
        ],
        dining: [
            { id: 301, name: 'Dining Table (6-seat)', price: 899.99, oldPrice: 1249.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Extendable oak table.', rating: 4.8, reviewCount: 54, stock: 5, colors: ['#d69e2e', '#4a5568'], sizes: ['6-Seat', '8-Seat'], category: 'dining' },
            { id: 302, name: 'Dining Chair', price: 149.99, oldPrice: 199.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Mid-century dining chair.', rating: 4.6, reviewCount: 62, stock: 24, colors: ['#4a5568', '#d69e2e'], sizes: ['Standard'], category: 'dining' },
            { id: 303, name: 'Sideboard', price: 599.99, oldPrice: 799.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Buffet with glass doors.', rating: 4.7, reviewCount: 35, stock: 3, colors: ['#2d3748', '#d69e2e'], sizes: ['Standard'], category: 'dining' },
            { id: 304, name: 'Bar Stool', price: 129.99, oldPrice: 179.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable height bar stool.', rating: 4.5, reviewCount: 43, stock: 18, colors: ['#c53030', '#2d3748'], sizes: ['Set of 2'], category: 'dining' },
            { id: 305, name: 'Table Runner', price: 39.99, oldPrice: 59.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Linen table runner.', rating: 4.4, reviewCount: 21, stock: 40, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Standard'], category: 'dining' },
            { id: 306, name: 'Dinnerware Set', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '16-piece stoneware set.', rating: 4.8, reviewCount: 38, stock: 12, colors: ['#e2e8f0', '#4a5568'], sizes: ['16-Piece'], category: 'dining' },
            { id: 307, name: 'Wine Rack', price: 79.99, oldPrice: 109.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Wall-mounted wine rack.', rating: 4.6, reviewCount: 26, stock: 15, colors: ['#d69e2e', '#2d3748'], sizes: ['12-Bottle'], category: 'dining' },
            { id: 308, name: 'Chandelier', price: 349.99, oldPrice: 479.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern glass chandelier.', rating: 4.9, reviewCount: 29, stock: 2, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Standard'], category: 'lighting' },
            { id: 309, name: 'Placemat Set', price: 29.99, oldPrice: 44.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 6 woven placemats.', rating: 4.3, reviewCount: 17, stock: 50, colors: ['#d69e2e', '#4a5568'], sizes: ['Set of 6'], category: 'dining' },
            { id: 310, name: 'Serving Cart', price: 249.99, oldPrice: 349.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Stainless steel serving cart.', rating: 4.7, reviewCount: 34, stock: 6, colors: ['#e2e8f0', '#2d3748'], sizes: ['Standard'], category: 'dining' }
        ],
        office: [
            { id: 401, name: 'Ergonomic Chair', price: 499.99, oldPrice: 699.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable lumbar support.', rating: 4.9, reviewCount: 88, stock: 8, colors: ['#2d3748', '#4a5568'], sizes: ['Standard'], category: 'office' },
            { id: 402, name: 'Standing Desk', price: 699.99, oldPrice: 949.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Electric height-adjustable.', rating: 4.8, reviewCount: 56, stock: 4, colors: ['#d69e2e', '#4a5568'], sizes: ['48"', '60"', '72"'], category: 'office' },
            { id: 403, name: 'Desk Lamp', price: 89.99, oldPrice: 129.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'LED task lamp.', rating: 4.6, reviewCount: 42, stock: 20, colors: ['#e2e8f0', '#2d3748'], sizes: ['Standard'], category: 'lighting' },
            { id: 404, name: 'Bookshelf', price: 299.99, oldPrice: 419.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '5-shelf industrial bookshelf.', rating: 4.7, reviewCount: 37, stock: 7, colors: ['#4a5568', '#d69e2e'], sizes: ['5-Shelf'], category: 'office' },
            { id: 405, name: 'Office Drawer', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Rolling filing cabinet.', rating: 4.5, reviewCount: 23, stock: 9, colors: ['#2d3748', '#e2e8f0'], sizes: ['2-Drawer', '3-Drawer'], category: 'office' },
            { id: 406, name: 'Monitor Stand', price: 59.99, oldPrice: 84.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable monitor riser.', rating: 4.4, reviewCount: 31, stock: 25, colors: ['#e2e8f0', '#2d3748'], sizes: ['Standard'], category: 'office' },
            { id: 407, name: 'Desk Mat', price: 39.99, oldPrice: 54.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Leather desk mat.', rating: 4.7, reviewCount: 44, stock: 30, colors: ['#2d3748', '#d69e2e'], sizes: ['Standard', 'Large'], category: 'office' },
            { id: 408, name: 'Pen Holder', price: 19.99, oldPrice: 29.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic pen organizer.', rating: 4.3, reviewCount: 19, stock: 45, colors: ['#e2e8f0', '#c53030'], sizes: ['Standard'], category: 'office' },
            { id: 409, name: 'Wall Organizer', price: 49.99, oldPrice: 69.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Pegboard wall organizer.', rating: 4.5, reviewCount: 27, stock: 12, colors: ['#d69e2e', '#4a5568'], sizes: ['Standard'], category: 'office' },
            { id: 410, name: 'Footrest', price: 69.99, oldPrice: 99.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ergonomic footrest.', rating: 4.6, reviewCount: 35, stock: 14, colors: ['#2d3748', '#e2e8f0'], sizes: ['Standard'], category: 'office' }
        ],
        lighting: [
            { id: 501, name: 'Pendant Light', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Brass pendant with glass shade.', rating: 4.8, reviewCount: 46, stock: 10, colors: ['#d69e2e', '#2d3748'], sizes: ['Small', 'Large'], category: 'lighting' },
            { id: 502, name: 'Floor Lamp', price: 149.99, oldPrice: 209.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Tripod floor lamp.', rating: 4.6, reviewCount: 38, stock: 8, colors: ['#e2e8f0', '#4a5568'], sizes: ['Standard'], category: 'lighting' },
            { id: 503, name: 'Table Lamp', price: 89.99, oldPrice: 129.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic table lamp.', rating: 4.7, reviewCount: 52, stock: 16, colors: ['#c53030', '#e2e8f0'], sizes: ['Standard'], category: 'lighting' },
            { id: 504, name: 'Wall Sconce', price: 79.99, oldPrice: 109.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 2 wall sconces.', rating: 4.5, reviewCount: 29, stock: 20, colors: ['#d69e2e', '#2d3748'], sizes: ['Set of 2'], category: 'lighting' },
            { id: 505, name: 'Chandelier', price: 599.99, oldPrice: 849.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Crystal chandelier.', rating: 4.9, reviewCount: 24, stock: 2, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Standard'], category: 'lighting' },
            { id: 506, name: 'Desk Lamp', price: 69.99, oldPrice: 99.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Architect desk lamp.', rating: 4.6, reviewCount: 41, stock: 13, colors: ['#2d3748', '#e2e8f0'], sizes: ['Standard'], category: 'lighting' },
            { id: 507, name: 'String Lights', price: 39.99, oldPrice: 59.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Indoor string lights.', rating: 4.4, reviewCount: 33, stock: 40, colors: ['#d69e2e', '#e2e8f0'], sizes: ['10ft', '20ft'], category: 'lighting' },
            { id: 508, name: 'Lantern', price: 59.99, oldPrice: 84.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Outdoor lantern.', rating: 4.5, reviewCount: 22, stock: 18, colors: ['#c53030', '#2d3748'], sizes: ['Small', 'Large'], category: 'lighting' },
            { id: 509, name: 'Spotlight', price: 49.99, oldPrice: 74.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable spotlight.', rating: 4.3, reviewCount: 18, stock: 22, colors: ['#e2e8f0', '#2d3748'], sizes: ['Standard'], category: 'lighting' },
            { id: 510, name: 'Night Light', price: 29.99, oldPrice: 44.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Smart night light.', rating: 4.7, reviewCount: 51, stock: 35, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Standard'], category: 'lighting' }
        ],
        decor: [
            { id: 601, name: 'Vase', price: 49.99, oldPrice: 69.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic vase set.', rating: 4.6, reviewCount: 28, stock: 25, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Set of 3'], category: 'decor' },
            { id: 602, name: 'Wall Art', price: 89.99, oldPrice: 129.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Abstract painting.', rating: 4.7, reviewCount: 35, stock: 14, colors: ['#c53030', '#d69e2e'], sizes: ['Small', 'Large'], category: 'decor' },
            { id: 603, name: 'Candle Set', price: 39.99, oldPrice: 59.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Scented candle set.', rating: 4.8, reviewCount: 62, stock: 30, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Set of 3'], category: 'decor' },
            { id: 604, name: 'Mirror', price: 149.99, oldPrice: 209.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Round decorative mirror.', rating: 4.9, reviewCount: 47, stock: 9, colors: ['#d69e2e', '#e2e8f0'], sizes: ['24"', '32"'], category: 'decor' },
            { id: 605, name: 'Throw Blanket', price: 69.99, oldPrice: 99.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Woven throw blanket.', rating: 4.7, reviewCount: 39, stock: 20, colors: ['#c53030', '#4a5568'], sizes: ['Standard'], category: 'decor' },
            { id: 606, name: 'Cushion Cover', price: 29.99, oldPrice: 44.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 2 cushion covers.', rating: 4.5, reviewCount: 44, stock: 40, colors: ['#d69e2e', '#e2e8f0'], sizes: ['Set of 2'], category: 'decor' },
            { id: 607, name: 'Plant Pot', price: 34.99, oldPrice: 49.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Terracotta plant pot.', rating: 4.6, reviewCount: 31, stock: 28, colors: ['#c53030', '#d69e2e'], sizes: ['Small', 'Medium', 'Large'], category: 'decor' },
            { id: 608, name: 'Sculpture', price: 119.99, oldPrice: 169.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern abstract sculpture.', rating: 4.8, reviewCount: 23, stock: 6, colors: ['#d69e2e', '#2d3748'], sizes: ['Standard'], category: 'decor' },
            { id: 609, name: 'Photo Frame', price: 24.99, oldPrice: 39.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 3 photo frames.', rating: 4.4, reviewCount: 26, stock: 50, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Set of 3'], category: 'decor' },
            { id: 610, name: 'Decorative Tray', price: 44.99, oldPrice: 64.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Gold decorative tray.', rating: 4.7, reviewCount: 33, stock: 18, colors: ['#d69e2e', '#e2e8f0'], sizes: ['Standard'], category: 'decor' }
        ]
    };

    const COUPONS = {
        'WELCOME10': { type: 'percent', value: 10, minOrder: 0, desc: '10% off your order' },
        'SAVE20': { type: 'fixed', value: 20, minOrder: 200, desc: '$20 off orders over $200' },
        'FREESHIP': { type: 'shipping', value: 0, minOrder: 0, desc: 'Free shipping' },
        'FLASH40': { type: 'percent', value: 40, minOrder: 0, desc: '40% off — Flash Sale!' }
    };

    const REVIEWS_DATA = [
        { id: 1, name: 'Sarah Johnson', initials: 'SJ', rating: 5, date: '2 weeks ago', title: 'Absolutely stunning!', text: 'The velvet sofa exceeded all my expectations. The color is rich and the cushions are incredibly comfortable.', verified: true, likes: 24, liked: false },
        { id: 2, name: 'Michael Chen', initials: 'MC', rating: 5, date: '1 month ago', title: 'Premium quality', text: 'You can tell this is high-quality furniture. The craftsmanship is superb.', verified: true, likes: 18, liked: false },
        { id: 3, name: 'Emily Rodriguez', initials: 'ER', rating: 4, date: '3 weeks ago', title: 'Great value', text: 'Beautiful piece for the price. Assembly took a bit longer than expected.', verified: true, likes: 12, liked: false },
        { id: 4, name: 'David Kim', initials: 'DK', rating: 5, date: '2 months ago', title: 'Perfect addition', text: 'Exactly what I was looking for. The minimalist design fits perfectly in my apartment.', verified: true, likes: 31, liked: false },
        { id: 5, name: 'Lisa Thompson', initials: 'LT', rating: 4, date: '1 week ago', title: 'Very comfortable', text: 'The ergonomic design is spot on. I work from home and this chair has made a huge difference.', verified: true, likes: 9, liked: false }
    ];

    // ============================================================
    // 2. STATE
    // ============================================================
    let currentUser = JSON.parse(localStorage.getItem('furni_user')) || null;
    let cart = JSON.parse(localStorage.getItem('furni_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('furni_wishlist')) || [];
    let compareList = JSON.parse(localStorage.getItem('furni_compare')) || [];
    let recentlyViewed = JSON.parse(localStorage.getItem('furni_recently_viewed')) || [];
    let theme = localStorage.getItem('furni_theme') || 'light';
    let reviews = JSON.parse(localStorage.getItem('furni_reviews')) || REVIEWS_DATA;
    let appliedCoupon = null;
    let quickViewQty = 1;
    let quickViewProduct = null;
    let checkoutStep = 1;
    let checkoutData = { shipping: {}, payment: {} };

    // ============================================================
    // 3. HELPERS
    // ============================================================
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    function saveCart() { localStorage.setItem('furni_cart', JSON.stringify(cart)); }
    function saveWishlist() { localStorage.setItem('furni_wishlist', JSON.stringify(wishlist)); }
    function saveCompare() { localStorage.setItem('furni_compare', JSON.stringify(compareList)); }
    function saveRecentlyViewed() { localStorage.setItem('furni_recently_viewed', JSON.stringify(recentlyViewed)); }
    function saveUser() { localStorage.setItem('furni_user', JSON.stringify(currentUser)); }
    function saveTheme() { localStorage.setItem('furni_theme', theme); }
    function saveReviews() { localStorage.setItem('furni_reviews', JSON.stringify(reviews)); }

    // Toast with queue
    function showToast(msg, type = 'success', actionText = null, actionFn = null) {
        const container = document.getElementById('toastContainer');
        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
        const toast = document.createElement('div');
        toast.className = `toast-item ${type}`;
        toast.innerHTML = `
                    <i class="fas ${icons[type] || icons.info} toast-icon"></i>
                    <span class="toast-msg">${msg}</span>
                    ${actionText ? `<button class="toast-action">${actionText}</button>` : ''}
                `;
        if (actionText && actionFn) {
            toast.querySelector('.toast-action').addEventListener('click', () => {
                actionFn();
                dismissToast(toast);
            });
        }
        container.appendChild(toast);
        setTimeout(() => dismissToast(toast), 3500);
    }

    function dismissToast(toast) {
        if (!toast.parentNode) return;
        toast.classList.add('leaving');
        setTimeout(() => toast.remove(), 300);
    }

    function getStars(rating) {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        let html = '';
        for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
        if (half) html += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < 5 - full - (half ? 1 : 0); i++) html += '<i class="far fa-star"></i>';
        return html;
    }

    function findProductById(id) {
        let p = FEATURED.find(x => x.id === id);
        if (p) return p;
        for (let cat in CATEGORY_PRODUCTS) {
            const found = CATEGORY_PRODUCTS[cat].find(x => x.id === id);
            if (found) return found;
        }
        return null;
    }

    function getAllProducts() {
        let all = [...FEATURED];
        for (let cat in CATEGORY_PRODUCTS) all = all.concat(CATEGORY_PRODUCTS[cat]);
        return all;
    }

    function getStockStatus(stock) {
        if (stock === 0) return { class: 'out-of-stock', label: 'Out of Stock', color: 'var(--danger)' };
        if (stock <= 5) return { class: 'low-stock', label: `Only ${stock} left!`, color: 'var(--warning)' };
        return { class: 'in-stock', label: 'In Stock', color: 'var(--success)' };
    }

    // Loyalty points
    function getUserPoints() {
        if (!currentUser) return 0;
        const key = `furni_loyalty_${currentUser.email}`;
        return parseInt(localStorage.getItem(key)) || 0;
    }

    function addPoints(amount) {
        if (!currentUser) return;
        const key = `furni_loyalty_${currentUser.email}`;
        const current = parseInt(localStorage.getItem(key)) || 0;
        localStorage.setItem(key, current + amount);
        updatePointsUI();
    }

    function updatePointsUI() {
        const pts = getUserPoints();
        const display = document.getElementById('pointsDisplay');
        const count = document.getElementById('pointsCount');
        if (count) count.textContent = pts;
        if (display) display.style.display = currentUser ? 'flex' : 'none';
    }

    function getTier(points) {
        if (points >= 10000) return { name: 'Platinum', icon: '💎', color: '#7c3aed', next: null };
        if (points >= 5000) return { name: 'Gold', icon: '🥇', color: '#d69e2e', next: 10000 };
        if (points >= 1000) return { name: 'Silver', icon: '🥈', color: '#a0aec0', next: 5000 };
        return { name: 'Bronze', icon: '🥉', color: '#cd7f32', next: 1000 };
    }

    // ============================================================
    // 4. RENDERING
    // ============================================================
    function renderProductGrid(products, container) {
        if (!container) return;
        container.innerHTML = products.map(p => {
            const inWishlist = wishlist.includes(p.id);
            const inCompare = compareList.includes(p.id);
            const isNew = p.isNew || false;
            const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
            const stockStatus = getStockStatus(p.stock || 10);
            const isOutOfStock = p.stock === 0;

            return `
                    <div class="product-card" data-id="${p.id}">
                        <div class="product-image-wrapper">
                            ${isNew ? '<span class="sale-badge badge-new">New</span>' : ''}
                            ${discount > 0 && !isNew ? `<span class="sale-badge badge-sale">-${discount}%</span>` : ''}
                            <span class="stock-badge ${stockStatus.class}">${stockStatus.label}</span>
                            <button class="compare-btn ${inCompare ? 'active' : ''}" data-id="${p.id}" title="Compare">
                                <i class="fas fa-balance-scale"></i>
                            </button>
                            <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${p.id}" title="Wishlist">
                                <i class="fas fa-heart"></i>
                            </button>
                            <img src="${p.image}" alt="${p.name}" loading="lazy">
                            <div class="quick-view-overlay">
                                <button class="quick-view-trigger" data-id="${p.id}">
                                    <i class="fas fa-eye"></i> Quick View
                                </button>
                            </div>
                        </div>
                        <div class="product-body">
                            <h3 class="quick-view-trigger" data-id="${p.id}">${p.name}</h3>
                            <div class="product-rating">
                                <span class="stars">${getStars(p.rating || 4.5)}</span>
                                <span>(${p.reviewCount || 0})</span>
                            </div>
                            <div class="desc">${p.desc}</div>
                            <div class="product-price-row">
                                <span class="price">$${p.price.toFixed(2)}</span>
                                ${p.oldPrice ? `<span class="old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <div class="product-actions">
                                <button class="btn btn-small ${isOutOfStock ? 'btn-outline' : 'btn-success'} add-cart" data-id="${p.id}" ${isOutOfStock ? 'disabled' : ''}>
                                    <i class="fas fa-${isOutOfStock ? 'times' : 'plus'}"></i> ${isOutOfStock ? 'Out' : 'Add'}
                                </button>
                                <button class="btn btn-small btn-outline quick-view-trigger" data-id="${p.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `}).join('');

        // Attach events (delegation would be better but keeping simple)
        container.querySelectorAll('.add-cart').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (this.disabled) return;
                addToCart(parseInt(this.dataset.id));
            });
        });
        container.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleWishlist(parseInt(this.dataset.id));
            });
        });
        container.querySelectorAll('.compare-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleCompare(parseInt(this.dataset.id));
            });
        });
        container.querySelectorAll('.quick-view-trigger').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                openQuickView(parseInt(this.dataset.id));
            });
        });
    }

    // ============================================================
    // 5. CART
    // ============================================================
    function addToCart(productId, qty = 1) {
        if (!currentUser) {
            showToast('Please sign in first', 'warning');
            openAuthModal('signin');
            return;
        }
        const product = findProductById(productId);
        if (!product || product.stock === 0) return;
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ id: productId, name: product.name, price: product.price, image: product.image, qty });
        }
        saveCart();
        updateCartUI();
        addToRecentlyViewed(productId);
        showToast(`${product.name} added to cart`, 'success', 'View Cart', () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        });
    }

    function updateCartUI() {
        const count = cart.reduce((sum, i) => sum + i.qty, 0);
        document.getElementById('cartCount').textContent = count;
        const itemsEl = document.getElementById('cartItems');
        const footerEl = document.getElementById('cartFooter');
        if (cart.length === 0) {
            itemsEl.innerHTML = `<div class="cart-empty"><i class="fas fa-box-open"></i><p>Your cart is empty</p></div>`;
            footerEl.style.display = 'none';
            return;
        }
        itemsEl.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-actions">
                                <button class="qty-dec" data-id="${item.id}">−</button>
                                <span>${item.qty}</span>
                                <button class="qty-inc" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-times"></i></button>
                    </div>
                `).join('');

        itemsEl.querySelectorAll('.qty-dec').forEach(b => b.addEventListener('click', function () { updateQty(parseInt(this.dataset.id), -1); }));
        itemsEl.querySelectorAll('.qty-inc').forEach(b => b.addEventListener('click', function () { updateQty(parseInt(this.dataset.id), 1); }));
        itemsEl.querySelectorAll('.cart-item-remove').forEach(b => b.addEventListener('click', function () { removeFromCart(parseInt(this.dataset.id)); }));

        const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
        document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
        footerEl.style.display = 'block';
    }

    function updateQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) return removeFromCart(id);
        saveCart();
        updateCartUI();
    }

    function removeFromCart(id) {
        cart = cart.filter(i => i.id !== id);
        saveCart();
        updateCartUI();
        showToast('Item removed', 'info');
    }

    // ============================================================
    // 6. WISHLIST
    // ============================================================
    function toggleWishlist(id) {
        const idx = wishlist.indexOf(id);
        if (idx > -1) {
            wishlist.splice(idx, 1);
            showToast('Removed from wishlist', 'info');
        } else {
            wishlist.push(id);
            showToast('Added to wishlist!', 'success');
        }
        saveWishlist();
        updateWishlistUI();
    }

    function updateWishlistUI() {
        document.getElementById('wishlistCount').textContent = wishlist.length;
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const id = parseInt(btn.dataset.id);
            btn.classList.toggle('active', wishlist.includes(id));
        });
    }

    // ============================================================
    // 7. COMPARE
    // ============================================================
    function toggleCompare(id) {
        const idx = compareList.indexOf(id);
        if (idx > -1) {
            compareList.splice(idx, 1);
            showToast('Removed from compare', 'info');
        } else {
            if (compareList.length >= 4) {
                showToast('You can compare up to 4 products', 'warning');
                return;
            }
            compareList.push(id);
            showToast('Added to compare', 'success');
        }
        saveCompare();
        updateCompareUI();
    }

    function updateCompareUI() {
        document.getElementById('compareCount').textContent = compareList.length;
        document.querySelectorAll('.compare-btn').forEach(btn => {
            const id = parseInt(btn.dataset.id);
            btn.classList.toggle('active', compareList.includes(id));
        });
        const bar = document.getElementById('compareBar');
        const items = document.getElementById('compareItems');
        if (compareList.length > 0) {
            bar.classList.add('active');
            items.innerHTML = compareList.map(id => {
                const p = findProductById(id);
                if (!p) return '';
                return `
                            <div class="compare-item">
                                <img src="${p.image}" alt="${p.name}">
                                <span>${p.name.length > 20 ? p.name.slice(0, 20) + '...' : p.name}</span>
                                <button class="remove-compare" data-id="${id}"><i class="fas fa-times"></i></button>
                            </div>
                        `;
            }).join('');
            items.querySelectorAll('.remove-compare').forEach(btn => {
                btn.addEventListener('click', () => toggleCompare(parseInt(btn.dataset.id)));
            });
        } else {
            bar.classList.remove('active');
        }
    }

    function openCompareModal() {
        if (compareList.length < 2) {
            showToast('Add at least 2 products to compare', 'warning');
            return;
        }
        const products = compareList.map(id => findProductById(id)).filter(Boolean);
        const lowestPrice = Math.min(...products.map(p => p.price));
        const highestRating = Math.max(...products.map(p => p.rating || 0));

        const grid = document.getElementById('compareGrid');
        grid.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                ${products.map(p => `
                                    <th class="product-cell">
                                        <img src="${p.image}" alt="${p.name}">
                                        <h4>${p.name}</h4>
                                        <div class="price">$${p.price.toFixed(2)}</div>
                                        <button class="btn btn-small btn-success add-cart-compare" data-id="${p.id}" style="width:100%;justify-content:center;"><i class="fas fa-plus"></i> Add to Cart</button>
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            <tr><th>Price</th>${products.map(p => `<td class="${p.price === lowestPrice ? 'compare-best' : ''}">$${p.price.toFixed(2)}</td>`).join('')}</tr>
                            <tr><th>Rating</th>${products.map(p => `<td class="${p.rating === highestRating ? 'compare-best' : ''}">${p.rating} ★</td>`).join('')}</tr>
                            <tr><th>Reviews</th>${products.map(p => `<td>${p.reviewCount}</td>`).join('')}</tr>
                            <tr><th>Category</th>${products.map(p => `<td>${p.category}</td>`).join('')}</tr>
                            <tr><th>Stock</th>${products.map(p => `<td>${p.stock > 0 ? p.stock + ' units' : 'Out of stock'}</td>`).join('')}</tr>
                            <tr><th>Colors</th>${products.map(p => `<td>${(p.colors || []).length} options</td>`).join('')}</tr>
                            <tr><th>Sizes</th>${products.map(p => `<td>${(p.sizes || []).join(', ')}</td>`).join('')}</tr>
                            <tr><th>Description</th>${products.map(p => `<td>${p.desc}</td>`).join('')}</tr>
                        </tbody>
                    </table>
                `;
        grid.querySelectorAll('.add-cart-compare').forEach(btn => {
            btn.addEventListener('click', function () {
                addToCart(parseInt(this.dataset.id));
            });
        });
        document.getElementById('compareModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // ============================================================
    // 8. QUICK VIEW
    // ============================================================
    function openQuickView(id) {
        const p = findProductById(id);
        if (!p) return;
        quickViewProduct = p;
        quickViewQty = 1;
        const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
        const stockStatus = getStockStatus(p.stock || 10);

        document.getElementById('quickViewBody').innerHTML = `
                    <div class="quick-view-gallery">
                        <img src="${p.image}" alt="${p.name}" class="quick-view-main-image" id="qvMainImage">
                        <div class="quick-view-thumbnails">
                            <img src="${p.image}" alt="${p.name}" class="active">
                            <img src="${p.image}" alt="${p.name}">
                            <img src="${p.image}" alt="${p.name}">
                        </div>
                    </div>
                    <div class="quick-view-details">
                        <h2>${p.name}</h2>
                        <div class="quick-view-rating">
                            <span class="stars">${getStars(p.rating || 4.5)}</span>
                            <span class="review-count">${p.rating || 4.5} · ${p.reviewCount || 0} reviews</span>
                            <span class="stock-indicator ${stockStatus.class}"><i class="fas fa-circle" style="font-size:0.5rem;"></i> ${stockStatus.label}</span>
                        </div>
                        <div class="quick-view-price">
                            <span class="current">$${p.price.toFixed(2)}</span>
                            ${p.oldPrice ? `<span class="old">$${p.oldPrice.toFixed(2)}</span>` : ''}
                            ${discount > 0 ? `<span class="discount">-${discount}% OFF</span>` : ''}
                        </div>
                        <div class="quick-view-desc">${p.desc}</div>

                        ${p.colors ? `<div class="quick-view-option"><label>Color</label><div class="color-options">${p.colors.map((c, i) => `<div class="color-option ${i === 0 ? 'active' : ''}" style="background:${c}" data-color="${c}"></div>`).join('')}</div></div>` : ''}
                        ${p.sizes ? `<div class="quick-view-option"><label>Size</label><div class="size-options">${p.sizes.map((s, i) => `<div class="size-option ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</div>`).join('')}</div></div>` : ''}

                        <div class="quick-view-actions">
                            <div class="qty-selector">
                                <button id="qvQtyDec">−</button>
                                <span id="qvQty">1</span>
                                <button id="qvQtyInc">+</button>
                            </div>
                            <button class="btn ${p.stock === 0 ? 'btn-outline' : ''}" id="qvAddToCart" ${p.stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-shopping-bag"></i> ${p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            <button class="btn btn-outline" id="qvWishlist"><i class="fas fa-heart"></i></button>
                            <button class="btn btn-outline" id="qvCompare"><i class="fas fa-balance-scale"></i></button>
                        </div>

                        <div class="quick-view-meta">
                            <p><i class="fas fa-truck"></i> Free shipping on orders over $500</p>
                            <p><i class="fas fa-undo"></i> 30-day return policy</p>
                        </div>

                        <div class="quick-view-share">
                            <span style="font-size:0.85rem;color:var(--text-muted);align-self:center;">Share:</span>
                            <button class="share-btn" data-share="copy" title="Copy Link"><i class="fas fa-link"></i></button>
                            <button class="share-btn" data-share="facebook" title="Facebook"><i class="fab fa-facebook-f"></i></button>
                            <button class="share-btn" data-share="twitter" title="Twitter"><i class="fab fa-twitter"></i></button>
                            <button class="share-btn" data-share="pinterest" title="Pinterest"><i class="fab fa-pinterest"></i></button>
                            <button class="share-btn" data-share="whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></button>
                            <button class="share-btn" data-share="email" title="Email"><i class="fas fa-envelope"></i></button>
                        </div>
                    </div>
                `;

        document.getElementById('quickViewModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        addToRecentlyViewed(id);

        // Events
        document.getElementById('qvQtyDec').addEventListener('click', () => { if (quickViewQty > 1) { quickViewQty--; document.getElementById('qvQty').textContent = quickViewQty; } });
        document.getElementById('qvQtyInc').addEventListener('click', () => { quickViewQty++; document.getElementById('qvQty').textContent = quickViewQty; });
        document.getElementById('qvAddToCart').addEventListener('click', () => { if (p.stock > 0) { addToCart(id, quickViewQty); closeQuickView(); } });
        document.getElementById('qvWishlist').addEventListener('click', function () { toggleWishlist(id); this.style.color = wishlist.includes(id) ? 'var(--danger)' : ''; });
        document.getElementById('qvCompare').addEventListener('click', function () { toggleCompare(id); this.style.color = compareList.includes(id) ? 'var(--primary)' : ''; });

        document.querySelectorAll('#quickViewBody .color-option').forEach(opt => {
            opt.addEventListener('click', function () {
                document.querySelectorAll('#quickViewBody .color-option').forEach(o => o.classList.remove('active'));
                this.classList.add('active');
            });
        });
        document.querySelectorAll('#quickViewBody .size-option').forEach(opt => {
            opt.addEventListener('click', function () {
                document.querySelectorAll('#quickViewBody .size-option').forEach(o => o.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Image zoom
        document.getElementById('qvMainImage').addEventListener('click', function () {
            const overlay = document.getElementById('imageZoomOverlay');
            document.getElementById('zoomedImage').src = this.src;
            overlay.classList.add('active');
        });

        // Share buttons
        document.querySelectorAll('#quickViewBody .share-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const type = this.dataset.share;
                shareProduct(p, type);
            });
        });
    }

    function shareProduct(product, type) {
        const url = window.location.origin + window.location.pathname + '#product-' + product.id;
        const text = `Check out ${product.name} on FurniCraft!`;
        switch (type) {
            case 'copy':
                navigator.clipboard.writeText(url).then(() => showToast('Link copied!', 'success'));
                break;
            case 'facebook': window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'); break;
            case 'twitter': window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank'); break;
            case 'pinterest': window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(text)}`, '_blank'); break;
            case 'whatsapp': window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank'); break;
            case 'email': window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`; break;
        }
    }

    function closeQuickView() {
        document.getElementById('quickViewModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================================
    // 9. RECENTLY VIEWED
    // ============================================================
    function addToRecentlyViewed(id) {
        recentlyViewed = recentlyViewed.filter(x => x !== id);
        recentlyViewed.unshift(id);
        if (recentlyViewed.length > 6) recentlyViewed = recentlyViewed.slice(0, 6);
        saveRecentlyViewed();
        renderRecentlyViewed();
    }

    function renderRecentlyViewed() {
        if (recentlyViewed.length === 0) {
            document.getElementById('recentlyViewed').style.display = 'none';
            return;
        }
        document.getElementById('recentlyViewed').style.display = 'block';
        const products = recentlyViewed.map(id => findProductById(id)).filter(Boolean);
        renderProductGrid(products, document.getElementById('recentlyViewedGrid'));
    }

    // ============================================================
    // 10. AUTH
    // ============================================================
    function openAuthModal(tab = 'signin') {
        document.getElementById('authModal').classList.add('active');
        document.querySelectorAll('.auth-tabs button').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.toggle('active', f.id === (tab === 'signin' ? 'formSignin' : 'formSignup')));
        document.body.style.overflow = 'hidden';
    }

    function closeAuthModal() {
        document.getElementById('authModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateUserUI() {
        const nameEl = document.getElementById('userNameDisplay');
        const avatar = document.getElementById('userAvatar');
        const dashNav = document.getElementById('dashboardNavItem');
        const mobileDash = document.getElementById('mobileDashboardNav');
        if (currentUser) {
            const name = currentUser.name.split(' ')[0];
            nameEl.textContent = name;
            avatar.innerHTML = `<i class="fas fa-user-circle"></i><span>${name}</span>`;
            if (dashNav) dashNav.style.display = 'block';
            if (mobileDash) mobileDash.style.display = 'block';
            document.getElementById('pointsDisplay').style.display = 'flex';
        } else {
            nameEl.textContent = 'Sign in';
            avatar.innerHTML = `<i class="fas fa-user-circle"></i><span>Sign in</span>`;
            if (dashNav) dashNav.style.display = 'none';
            if (mobileDash) mobileDash.style.display = 'none';
            document.getElementById('pointsDisplay').style.display = 'none';
        }
        updatePointsUI();
    }

    // ============================================================
    // 11. CHECKOUT
    // ============================================================
    function openCheckout() {
        if (!currentUser) {
            showToast('Please sign in to checkout', 'warning');
            document.getElementById('cartSidebar').classList.remove('active');
            document.getElementById('cartOverlay').classList.remove('active');
            setTimeout(() => openAuthModal('signin'), 300);
            return;
        }
        if (cart.length === 0) { showToast('Your cart is empty', 'warning'); return; }
        checkoutStep = 1;
        checkoutData = { shipping: {}, payment: {} };
        appliedCoupon = null;
        renderCheckout();
        document.getElementById('checkoutModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('cartSidebar').classList.remove('active');
        document.getElementById('cartOverlay').classList.remove('active');
    }

    function closeCheckout() {
        document.getElementById('checkoutModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    function calculateTotals() {
        const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
        let shipping = subtotal > 500 ? 0 : 25;
        let discount = 0;
        if (appliedCoupon) {
            const c = COUPONS[appliedCoupon];
            if (c.type === 'percent') discount = subtotal * (c.value / 100);
            else if (c.type === 'fixed') discount = c.value;
            else if (c.type === 'shipping') shipping = 0;
        }
        const tax = (subtotal - discount) * 0.08;
        const total = subtotal - discount + shipping + tax;
        return { subtotal, shipping, discount, tax, total };
    }

    function renderCheckout() {
        document.querySelectorAll('.checkout-step').forEach(step => {
            const n = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            if (n === checkoutStep) step.classList.add('active');
            if (n < checkoutStep) step.classList.add('completed');
        });

        const t = calculateTotals();
        const body = document.getElementById('checkoutBody');

        if (checkoutStep === 1) {
            body.innerHTML = `
                        <div class="checkout-panel active">
                            <h3><i class="fas fa-shopping-bag"></i> Review Your Cart</h3>
                            <div class="checkout-summary">
                                ${cart.map(i => `<div class="checkout-summary-item"><span>${i.name} × ${i.qty}</span><span>$${(i.price * i.qty).toFixed(2)}</span></div>`).join('')}
                                <div class="checkout-summary-item total"><span>Subtotal</span><span>$${t.subtotal.toFixed(2)}</span></div>
                            </div>
                            <div class="coupon-section">
                                <label style="font-weight:600;font-size:0.85rem;margin-bottom:0.5rem;display:block;">Have a coupon?</label>
                                <div class="coupon-input-row">
                                    <input type="text" id="couponInput" placeholder="Enter code" style="text-transform:uppercase;">
                                    <button class="btn btn-small" id="applyCoupon">Apply</button>
                                </div>
                                <div class="coupon-tags">
                                    ${Object.keys(COUPONS).map(c => `<span class="coupon-tag" data-code="${c}">${c}</span>`).join('')}
                                </div>
                            </div>
                            <div class="checkout-actions">
                                <button class="btn btn-outline" onclick="closeCheckout()">Continue Shopping</button>
                                <button class="btn" onclick="goToStep(2)">Next: Shipping <i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                    `;
            document.getElementById('applyCoupon').addEventListener('click', applyCouponCode);
            document.querySelectorAll('.coupon-tag').forEach(tag => {
                tag.addEventListener('click', () => {
                    document.getElementById('couponInput').value = tag.dataset.code;
                    applyCouponCode();
                });
            });
        } else if (checkoutStep === 2) {
            const s = checkoutData.shipping || {};
            body.innerHTML = `
                        <div class="checkout-panel active">
                            <h3><i class="fas fa-truck"></i> Shipping Information</h3>
                            <div class="form-group"><label>Full Name</label><input type="text" id="sName" value="${s.name || ''}" required></div>
                            <div class="form-group"><label>Email</label><input type="email" id="sEmail" value="${s.email || ''}" required></div>
                            <div class="form-group"><label>Phone</label><input type="tel" id="sPhone" value="${s.phone || ''}"></div>
                            <div class="form-group"><label>Street</label><input type="text" id="sStreet" value="${s.street || ''}" required></div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                                <div class="form-group"><label>City</label><input type="text" id="sCity" value="${s.city || ''}" required></div>
                                <div class="form-group"><label>State</label><input type="text" id="sState" value="${s.state || ''}" required></div>
                            </div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                                <div class="form-group"><label>ZIP</label><input type="text" id="sZip" value="${s.zip || ''}" required></div>
                                <div class="form-group"><label>Country</label><input type="text" id="sCountry" value="${s.country || 'USA'}" required></div>
                            </div>
                            <div class="checkout-actions">
                                <button class="btn btn-outline" onclick="goToStep(1)"><i class="fas fa-arrow-left"></i> Back</button>
                                <button class="btn" onclick="saveShipping()">Next: Payment <i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                    `;
        } else if (checkoutStep === 3) {
            body.innerHTML = `
                        <div class="checkout-panel active">
                            <h3><i class="fas fa-credit-card"></i> Payment Method</h3>
                            <div class="payment-methods">
                                <div class="payment-method active" data-method="card"><i class="fas fa-credit-card"></i><div class="payment-info"><div class="name">Credit / Debit Card</div><div class="desc">Visa, Mastercard, Amex</div></div></div>
                                <div class="payment-method" data-method="paypal"><i class="fab fa-paypal"></i><div class="payment-info"><div class="name">PayPal</div><div class="desc">Pay with your PayPal account</div></div></div>
                                <div class="payment-method" data-method="cod"><i class="fas fa-money-bill-wave"></i><div class="payment-info"><div class="name">Cash on Delivery</div><div class="desc">Pay when your order arrives</div></div></div>
                            </div>
                            <div id="cardFields">
                                <div class="form-group"><label>Card Number</label><input type="text" id="cardNum" placeholder="1234 5678 9012 3456"></div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                                    <div class="form-group"><label>Expiry</label><input type="text" id="cardExp" placeholder="MM/YY"></div>
                                    <div class="form-group"><label>CVV</label><input type="text" id="cardCvv" placeholder="123"></div>
                                </div>
                            </div>
                            <div class="checkout-actions">
                                <button class="btn btn-outline" onclick="goToStep(2)"><i class="fas fa-arrow-left"></i> Back</button>
                                <button class="btn" onclick="savePayment()">Review Order <i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                    `;
            checkoutData.payment = { method: 'card' };
            body.querySelectorAll('.payment-method').forEach(m => {
                m.addEventListener('click', function () {
                    body.querySelectorAll('.payment-method').forEach(x => x.classList.remove('active'));
                    this.classList.add('active');
                    checkoutData.payment.method = this.dataset.method;
                    document.getElementById('cardFields').style.display = this.dataset.method === 'card' ? 'block' : 'none';
                });
            });
        } else if (checkoutStep === 4) {
            const s = checkoutData.shipping;
            const p = checkoutData.payment;
            body.innerHTML = `
                        <div class="checkout-panel active">
                            <h3><i class="fas fa-check-circle"></i> Confirm Your Order</h3>
                            <div class="checkout-summary">
                                <div style="margin-bottom:1rem;"><strong>Ship to:</strong><br>${s.name}<br>${s.street}<br>${s.city}, ${s.state} ${s.zip}</div>
                                <div style="margin-bottom:1rem;"><strong>Payment:</strong> ${p.method === 'card' ? 'Credit Card' : p.method === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</div>
                                ${cart.map(i => `<div class="checkout-summary-item"><span>${i.name} × ${i.qty}</span><span>$${(i.price * i.qty).toFixed(2)}</span></div>`).join('')}
                                <div class="checkout-summary-item"><span>Subtotal</span><span>$${t.subtotal.toFixed(2)}</span></div>
                                ${t.discount > 0 ? `<div class="checkout-summary-item discount"><span>Discount (${appliedCoupon})</span><span>−$${t.discount.toFixed(2)}</span></div>` : ''}
                                <div class="checkout-summary-item"><span>Shipping</span><span>${t.shipping === 0 ? 'FREE' : '$' + t.shipping.toFixed(2)}</span></div>
                                <div class="checkout-summary-item"><span>Tax</span><span>$${t.tax.toFixed(2)}</span></div>
                                <div class="checkout-summary-item total"><span>Total</span><span>$${t.total.toFixed(2)}</span></div>
                            </div>
                            <div class="checkout-actions">
                                <button class="btn btn-outline" onclick="goToStep(3)"><i class="fas fa-arrow-left"></i> Back</button>
                                <button class="btn btn-success" onclick="placeOrder()"><i class="fas fa-lock"></i> Place Order — $${t.total.toFixed(2)}</button>
                            </div>
                        </div>
                    `;
        }
    }

    function applyCouponCode() {
        const input = document.getElementById('couponInput');
        const code = input.value.trim().toUpperCase();
        if (!code) return;
        if (!COUPONS[code]) { showToast('Invalid coupon code', 'error'); return; }
        const c = COUPONS[code];
        const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
        if (subtotal < c.minOrder) { showToast(`Minimum order $${c.minOrder} required`, 'warning'); return; }
        appliedCoupon = code;
        showToast(`Coupon applied: ${c.desc}`, 'success');
        renderCheckout();
    }

    function goToStep(step) {
        checkoutStep = step;
        renderCheckout();
    }

    function saveShipping() {
        const s = {
            name: document.getElementById('sName').value.trim(),
            email: document.getElementById('sEmail').value.trim(),
            phone: document.getElementById('sPhone').value.trim(),
            street: document.getElementById('sStreet').value.trim(),
            city: document.getElementById('sCity').value.trim(),
            state: document.getElementById('sState').value.trim(),
            zip: document.getElementById('sZip').value.trim(),
            country: document.getElementById('sCountry').value.trim()
        };
        if (!s.name || !s.email || !s.street || !s.city || !s.state || !s.zip) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        checkoutData.shipping = s;
        goToStep(3);
    }

    function savePayment() {
        const method = checkoutData.payment.method || 'card';
        if (method === 'card') {
            const num = document.getElementById('cardNum').value.trim();
            const exp = document.getElementById('cardExp').value.trim();
            const cvv = document.getElementById('cardCvv').value.trim();
            if (!num || !exp || !cvv) { showToast('Please fill card details', 'error'); return; }
            checkoutData.payment = { method, num, exp, cvv };
        }
        goToStep(4);
    }

    function placeOrder() {
        const t = calculateTotals();
        const orderId = 'ORD-' + Date.now().toString().slice(-6);
        const order = {
            id: orderId,
            date: new Date().toISOString(),
            items: cart.reduce((sum, i) => sum + i.qty, 0),
            total: t.total,
            subtotal: t.subtotal,
            discount: t.discount,
            coupon: appliedCoupon,
            status: 'processing',
            shipping: checkoutData.shipping,
            payment: checkoutData.payment.method,
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            trackingNumber: 'TRK' + Date.now().toString().slice(-8)
        };

        // Save order
        const key = `furni_userdata_${currentUser.email}`;
        const userData = JSON.parse(localStorage.getItem(key)) || { addresses: [], orders: [], phone: '', profile: {} };
        userData.orders = userData.orders || [];
        userData.orders.unshift(order);
        localStorage.setItem(key, JSON.stringify(userData));

        // Add loyalty points (10 points per $1)
        const pointsEarned = Math.floor(t.total * 10);
        addPoints(pointsEarned);

        // Show success
        document.getElementById('checkoutBody').innerHTML = `
                    <div class="checkout-panel active">
                        <div class="order-success">
                            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                            <h3>Order Placed Successfully!</h3>
                            <p>Thank you for your purchase. A confirmation email has been sent.</p>
                            <div class="order-number">Order #${orderId}</div>
                            <p style="font-size:0.9rem;margin-bottom:0.5rem;">Estimated delivery: <strong>${new Date(order.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong></p>
                            <p style="font-size:0.9rem;color:var(--success);font-weight:600;margin-bottom:1.5rem;"><i class="fas fa-coins"></i> You earned ${pointsEarned} points!</p>
                            <div class="success-actions">
                                <button class="btn" onclick="viewOrderTracking('${orderId}')"><i class="fas fa-truck"></i> Track Order</button>
                                <button class="btn btn-outline" onclick="closeCheckout()">Continue Shopping</button>
                            </div>
                        </div>
                    </div>
                `;

        cart = [];
        saveCart();
        updateCartUI();
    }

    // ============================================================
    // 12. ORDER TRACKING
    // ============================================================
    function viewOrderTracking(orderId) {
        const key = `furni_userdata_${currentUser.email}`;
        const userData = JSON.parse(localStorage.getItem(key)) || {};
        const order = (userData.orders || []).find(o => o.id === orderId);
        if (!order) return;

        const statuses = ['processing', 'shipped', 'out-for-delivery', 'delivered'];
        const statusIndex = statuses.indexOf(order.status) === -1 ? 0 : statuses.indexOf(order.status);

        const timeline = [
            { key: 'ordered', label: 'Order Placed', desc: 'We received your order', icon: 'fa-check', days: 0 },
            { key: 'processing', label: 'Processing', desc: 'Preparing your items', icon: 'fa-box', days: 1 },
            { key: 'shipped', label: 'Shipped', desc: 'On the way to you', icon: 'fa-truck', days: 2 },
            { key: 'out-for-delivery', label: 'Out for Delivery', desc: 'Arriving today', icon: 'fa-shipping-fast', days: 4 },
            { key: 'delivered', label: 'Delivered', desc: 'Enjoy your purchase!', icon: 'fa-home', days: 5 }
        ];

        const content = `
                    <div class="checkout-panel active">
                        <h3><i class="fas fa-truck"></i> Order Tracking</h3>
                        <div style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);margin-bottom:1rem;">
                            <div style="font-weight:700;font-size:1rem;margin-bottom:0.3rem;">Order #${order.id}</div>
                            <div style="font-size:0.85rem;color:var(--text-muted);">Tracking: ${order.trackingNumber || 'N/A'}</div>
                            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:0.3rem;">Estimated Delivery: <strong style="color:var(--primary);">${new Date(order.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong></div>
                        </div>
                        <div class="order-timeline">
                            ${timeline.map((step, i) => {
            const isCompleted = i <= statusIndex + 1;
            const isActive = i === statusIndex + 1;
            return `
                                    <div class="timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                                        <div class="timeline-icon"><i class="fas ${step.icon}"></i></div>
                                        <div class="timeline-info">
                                            <div class="title">${step.label}</div>
                                            <div class="desc">${step.desc}</div>
                                        </div>
                                    </div>
                                `;
        }).join('')}
                        </div>
                        <div class="checkout-actions">
                            <button class="btn btn-outline" onclick="closeCheckout()">Close</button>
                            <button class="btn" onclick="closeCheckout()"><i class="fas fa-check"></i> Got it</button>
                        </div>
                    </div>
                `;
        document.getElementById('checkoutBody').innerHTML = content;
        document.getElementById('checkoutModal').classList.add('active');
    }

    // ============================================================
    // 13. DASHBOARD
    // ============================================================
    function showDashboard() {
        if (!currentUser) { showToast('Please sign in', 'warning'); openAuthModal('signin'); return; }
        document.getElementById('mainSections').style.display = 'none';
        document.querySelector('.newsletter-section').style.display = 'none';
        document.querySelector('footer').style.display = 'none';
        document.getElementById('categoryPage').classList.remove('active');
        document.getElementById('dashboardWrapper').classList.add('active');
        loadDashboard();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function hideDashboard() {
        document.getElementById('dashboardWrapper').classList.remove('active');
        document.getElementById('mainSections').style.display = '';
        document.querySelector('.newsletter-section').style.display = '';
        document.querySelector('footer').style.display = '';
    }

    function loadDashboard() {
        const userData = JSON.parse(localStorage.getItem(`furni_userdata_${currentUser.email}`)) || { addresses: [], orders: [], phone: '', profile: {} };
        document.getElementById('sidebarUserName').textContent = currentUser.name;
        document.getElementById('sidebarUserEmail').textContent = currentUser.email;
        document.getElementById('dashboardGreeting').textContent = currentUser.name.split(' ')[0];

        const totalSpent = (userData.orders || []).reduce((sum, o) => sum + (o.total || 0), 0);
        document.getElementById('statOrders').textContent = (userData.orders || []).length;
        document.getElementById('statSpent').textContent = '$' + totalSpent.toFixed(2);
        document.getElementById('statPoints').textContent = getUserPoints();
        document.getElementById('statWishlist').textContent = wishlist.length;

        renderDashboardPage('overview');
    }

    function renderDashboardPage(page) {
        const content = document.getElementById('dashboardPages');
        const userData = JSON.parse(localStorage.getItem(`furni_userdata_${currentUser.email}`)) || { addresses: [], orders: [], phone: '', profile: {} };

        if (page === 'overview') {
            const points = getUserPoints();
            const tier = getTier(points);
            const nextTier = tier.next;
            const progress = nextTier ? Math.min(100, (points / nextTier) * 100) : 100;
            content.innerHTML = `
                        <div class="content-grid">
                            <div class="content-card">
                                <div class="card-header"><h3><i class="fas fa-user"></i> Quick Profile</h3></div>
                                <p><strong>Name:</strong> ${currentUser.name}</p>
                                <p><strong>Email:</strong> ${currentUser.email}</p>
                                <p><strong>Phone:</strong> ${userData.phone || 'Not set'}</p>
                            </div>
                            <div class="loyalty-card">
                                <div class="tier-badge">${tier.icon} ${tier.name} Member</div>
                                <div class="points-big">${points.toLocaleString()}</div>
                                <div class="points-label">Reward Points</div>
                                <div class="tier-progress"><div class="tier-progress-bar" style="width:${progress}%"></div></div>
                                <div class="tier-info">
                                    <span>${tier.name}</span>
                                    <span>${nextTier ? (nextTier - points).toLocaleString() + ' pts to next tier' : 'Max tier reached!'}</span>
                                </div>
                            </div>
                            <div class="content-card" style="grid-column:1/-1;">
                                <div class="card-header"><h3><i class="fas fa-history"></i> Recent Orders</h3><span class="card-action" onclick="switchDashboardPage('orders')">View All</span></div>
                                ${(userData.orders || []).length === 0 ? '<div class="empty-state">No orders yet</div>' : userData.orders.slice(0, 3).map(o => `
                                    <div style="display:flex;justify-content:space-between;align-items:center;padding:0.7rem 0;border-bottom:1px solid var(--border);">
                                        <div>
                                            <div style="font-weight:600;font-size:0.9rem;">#${o.id}</div>
                                            <div style="font-size:0.75rem;color:var(--text-muted);">${new Date(o.date).toLocaleDateString()}</div>
                                        </div>
                                        <div style="font-weight:700;color:var(--primary);">$${o.total.toFixed(2)}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
        } else if (page === 'orders') {
            content.innerHTML = `
                        <div class="content-card">
                            <div class="card-header"><h3><i class="fas fa-history"></i> Order History</h3></div>
                            ${(userData.orders || []).length === 0 ? '<div class="empty-state">No orders yet. Start shopping!</div>' : userData.orders.map(o => `
                                <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:0.5rem;">
                                    <div>
                                        <div style="font-weight:600;">Order #${o.id}</div>
                                        <div style="font-size:0.8rem;color:var(--text-muted);">${new Date(o.date).toLocaleDateString()} · ${o.items} items</div>
                                        <span class="badge" style="margin-top:0.3rem;display:inline-block;">${o.status}</span>
                                    </div>
                                    <div style="display:flex;gap:0.5rem;align-items:center;">
                                        <div style="font-weight:700;color:var(--primary);">$${o.total.toFixed(2)}</div>
                                        <button class="btn btn-small btn-outline track-order" data-id="${o.id}"><i class="fas fa-truck"></i> Track</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
            content.querySelectorAll('.track-order').forEach(b => b.addEventListener('click', function () { viewOrderTracking(this.dataset.id); }));
        } else if (page === 'addresses') {
            content.innerHTML = `
                        <div class="content-card">
                            <div class="card-header"><h3><i class="fas fa-map-pin"></i> Saved Addresses</h3></div>
                            ${(userData.addresses || []).length === 0 ? '<div class="empty-state">No addresses saved yet</div>' : userData.addresses.map(a => `
                                <div style="padding:0.8rem;background:var(--surface-2);border-radius:var(--radius-sm);margin-bottom:0.6rem;border:1px solid var(--border);">
                                    <strong>${a.label || 'Address'}</strong><br>
                                    ${a.street}, ${a.city}, ${a.state} ${a.zip}
                                </div>
                            `).join('')}
                        </div>
                    `;
        } else if (page === 'loyalty') {
            const points = getUserPoints();
            const tier = getTier(points);
            const nextTier = tier.next;
            const progress = nextTier ? Math.min(100, (points / nextTier) * 100) : 100;
            content.innerHTML = `
                        <div class="content-card">
                            <div class="loyalty-card" style="margin-bottom:1.5rem;">
                                <div class="tier-badge">${tier.icon} ${tier.name} Member</div>
                                <div class="points-big">${points.toLocaleString()}</div>
                                <div class="points-label">Reward Points</div>
                                <div class="tier-progress"><div class="tier-progress-bar" style="width:${progress}%"></div></div>
                                <div class="tier-info"><span>${tier.name}</span><span>${nextTier ? (nextTier - points).toLocaleString() + ' pts to next tier' : 'Max tier!'}</span></div>
                            </div>
                            <h3 style="margin-bottom:1rem;">How to Earn Points</h3>
                            <ul style="list-style:none;padding:0;">
                                <li style="padding:0.6rem 0;border-bottom:1px solid var(--border);"><i class="fas fa-shopping-bag" style="color:var(--primary);margin-right:0.5rem;"></i> Earn 10 points per $1 spent</li>
                                <li style="padding:0.6rem 0;border-bottom:1px solid var(--border);"><i class="fas fa-star" style="color:var(--primary);margin-right:0.5rem;"></i> Write a review: 50 points</li>
                                <li style="padding:0.6rem 0;border-bottom:1px solid var(--border);"><i class="fas fa-user-plus" style="color:var(--primary);margin-right:0.5rem;"></i> Refer a friend: 500 points</li>
                                <li style="padding:0.6rem 0;"><i class="fas fa-birthday-cake" style="color:var(--primary);margin-right:0.5rem;"></i> Birthday bonus: 200 points</li>
                            </ul>
                        </div>
                    `;
        } else if (page === 'profile') {
            content.innerHTML = `
                        <div class="content-card">
                            <div class="card-header"><h3><i class="fas fa-user-edit"></i> Profile Settings</h3></div>
                            <form id="profileForm">
                                <div class="form-group"><label>Full Name</label><input type="text" id="pName" value="${currentUser.name}" required></div>
                                <div class="form-group"><label>Email</label><input type="email" id="pEmail" value="${currentUser.email}" required></div>
                                <div class="form-group"><label>Phone</label><input type="tel" id="pPhone" value="${userData.phone || ''}"></div>
                                <button type="submit" class="btn btn-small btn-success" style="margin-top:0.5rem;"><i class="fas fa-save"></i> Update Profile</button>
                            </form>
                        </div>
                    `;
            document.getElementById('profileForm').addEventListener('submit', function (e) {
                e.preventDefault();
                currentUser.name = document.getElementById('pName').value.trim();
                currentUser.email = document.getElementById('pEmail').value.trim();
                saveUser();
                const key = `furni_userdata_${currentUser.email}`;
                const d = JSON.parse(localStorage.getItem(key)) || {};
                d.phone = document.getElementById('pPhone').value.trim();
                localStorage.setItem(key, JSON.stringify(d));
                updateUserUI();
                loadDashboard();
                showToast('Profile updated!', 'success');
            });
        }
    }

    function switchDashboardPage(page) {
        document.querySelectorAll('.dashboard-sidebar .nav-item').forEach(i => i.classList.toggle('active', i.dataset.page === page));
        renderDashboardPage(page);
        document.getElementById('dashboardSidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('active');
    }

    // ============================================================
    // 14. CATEGORY PAGE
    // ============================================================
    function showCategoryPage(cat) {
        const products = CATEGORY_PRODUCTS[cat];
        if (!products) return;
        document.getElementById('mainSections').style.display = 'none';
        document.querySelector('.newsletter-section').style.display = 'none';
        document.querySelector('footer').style.display = 'none';
        document.getElementById('dashboardWrapper').classList.remove('active');
        document.getElementById('categoryPage').classList.add('active');
        document.getElementById('categoryPageTitle').innerHTML = `${cat.charAt(0).toUpperCase() + cat.slice(1)} <span>Collection</span>`;
        renderProductGrid(products, document.getElementById('categoryProductGrid'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function hideCategoryPage() {
        document.getElementById('categoryPage').classList.remove('active');
        document.getElementById('mainSections').style.display = '';
        document.querySelector('.newsletter-section').style.display = '';
        document.querySelector('footer').style.display = '';
        document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
    }

    // ============================================================
    // 15. FLASH SALE TIMER
    // ============================================================
    function startFlashTimer() {
        const end = new Date();
        end.setHours(end.getHours() + 8, end.getMinutes() + 45, end.getSeconds() + 30);
        setInterval(() => {
            const d = end - new Date();
            if (d < 0) return;
            document.getElementById('flashHours').textContent = String(Math.floor(d / 3600000)).padStart(2, '0');
            document.getElementById('flashMinutes').textContent = String(Math.floor(d % 3600000 / 60000)).padStart(2, '0');
            document.getElementById('flashSeconds').textContent = String(Math.floor(d % 60000 / 1000)).padStart(2, '0');
        }, 1000);
    }

    // ============================================================
    // 16. REVIEWS
    // ============================================================
    function renderReviews() {
        const list = document.getElementById('reviewsList');
        if (!list) return;
        list.innerHTML = reviews.map(r => `
                    <div class="review-card">
                        <div class="review-header">
                            <div class="review-avatar">${r.initials}</div>
                            <div class="review-info">
                                <div class="name">${r.name}${r.verified ? '<span class="verified"><i class="fas fa-check-circle"></i> Verified</span>' : ''}</div>
                                <div class="date">${r.date}</div>
                            </div>
                        </div>
                        <div class="review-stars">${getStars(r.rating)}</div>
                        <div class="review-title">${r.title}</div>
                        <div class="review-text">${r.text}</div>
                        <div class="review-actions">
                            <button class="like-btn ${r.liked ? 'liked' : ''}" data-id="${r.id}"><i class="fas fa-thumbs-up"></i> Helpful (${r.likes})</button>
                            <button><i class="fas fa-flag"></i> Report</button>
                        </div>
                    </div>
                `).join('');

        list.querySelectorAll('.like-btn').forEach(b => b.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const r = reviews.find(x => x.id === id);
            if (!r) return;
            r.liked = !r.liked;
            r.likes += r.liked ? 1 : -1;
            saveReviews();
            renderReviews();
        }));

        // Rating bars
        const barsEl = document.getElementById('ratingBars');
        if (barsEl) {
            const dist = [78, 15, 5, 1, 1];
            const counts = [99, 19, 6, 2, 1];
            barsEl.innerHTML = dist.map((p, i) => `
                        <div class="rating-bar">
                            <span class="bar-label">${5 - i} ★</span>
                            <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div>
                            <span class="bar-count">${counts[i]}</span>
                        </div>
                    `).join('');
        }
    }

    // ============================================================
    // 17. SEARCH
    // ============================================================
    function handleSearch(q) {
        const box = document.getElementById('searchSuggestions');
        if (!q.trim()) { box.classList.remove('active'); return; }
        const query = q.toLowerCase();
        const all = getAllProducts();
        const matches = all.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)).slice(0, 6);
        if (matches.length === 0) {
            box.innerHTML = `<div class="search-no-results"><i class="fas fa-search" style="font-size:1.5rem;opacity:0.4;display:block;margin-bottom:0.5rem;"></i>No results for "${q}"</div>`;
        } else {
            box.innerHTML = `
                        <div class="suggestion-section">
                            <div class="suggestion-section-title">Products</div>
                            ${matches.map(p => `
                                <div class="suggestion-item" data-id="${p.id}">
                                    <img src="${p.image}" alt="${p.name}">
                                    <div class="suggestion-item-info">
                                        <div class="name">${p.name}</div>
                                        <div class="price">$${p.price.toFixed(2)}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
            box.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function () {
                    openQuickView(parseInt(this.dataset.id));
                    box.classList.remove('active');
                    document.getElementById('searchInput').value = '';
                });
            });
        }
        box.classList.add('active');
    }

    // ============================================================
    // 18. INIT
    // ============================================================
    function init() {
        // Theme
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.querySelector('.theme-toggle i').className = 'fas fa-sun';
        }

        // Initial renders
        renderProductGrid(FEATURED, document.getElementById('productGrid'));
        renderRecentlyViewed();
        renderReviews();
        updateCartUI();
        updateWishlistUI();
        updateCompareUI();
        updateUserUI();
        updatePointsUI();
        startFlashTimer();

        // Search
        document.getElementById('searchInput').addEventListener('input', function () { handleSearch(this.value); });
        document.getElementById('searchInput').addEventListener('focus', function () { if (this.value.trim()) handleSearch(this.value); });
        document.addEventListener('click', function (e) { if (!e.target.closest('.search-wrapper')) document.getElementById('searchSuggestions').classList.remove('active'); });

        // Nav links
        document.querySelectorAll('.nav-links a, .mobile-menu a[href^="#"]').forEach(a => {
            a.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#dashboard') { e.preventDefault(); showDashboard(); document.getElementById('mobileMenu').classList.remove('active'); return; }
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    if (document.getElementById('categoryPage').classList.contains('active')) hideCategoryPage();
                    if (document.getElementById('dashboardWrapper').classList.contains('active')) hideDashboard();
                    const el = document.querySelector(href);
                    if (el) {
                        const headerH = document.querySelector('header').offsetHeight + document.getElementById('flashSaleBanner').offsetHeight;
                        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - headerH, behavior: 'smooth' });
                    }
                }
            });
        });

        // Home
        document.getElementById('homeLink').addEventListener('click', function () {
            if (document.getElementById('categoryPage').classList.contains('active')) hideCategoryPage();
            if (document.getElementById('dashboardWrapper').classList.contains('active')) hideDashboard();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Categories
        document.querySelectorAll('.category-card').forEach(c => c.addEventListener('click', function () { showCategoryPage(this.dataset.category); }));
        document.getElementById('backFromCategory').addEventListener('click', hideCategoryPage);

        // Cart
        document.getElementById('cartOpen').addEventListener('click', () => { document.getElementById('cartSidebar').classList.add('active'); document.getElementById('cartOverlay').classList.add('active'); });
        document.getElementById('cartClose').addEventListener('click', () => { document.getElementById('cartSidebar').classList.remove('active'); document.getElementById('cartOverlay').classList.remove('active'); });
        document.getElementById('cartOverlay').addEventListener('click', () => { document.getElementById('cartSidebar').classList.remove('active'); document.getElementById('cartOverlay').classList.remove('active'); });
        document.getElementById('checkoutBtn').addEventListener('click', openCheckout);

        // Wishlist open
        document.getElementById('wishlistOpen').addEventListener('click', () => {
            if (wishlist.length === 0) { showToast('Your wishlist is empty', 'info'); return; }
            showToast(`${wishlist.length} items in wishlist`, 'info');
        });

        // Compare
        document.getElementById('compareOpen').addEventListener('click', openCompareModal);
        document.getElementById('openCompareModal').addEventListener('click', openCompareModal);
        document.getElementById('clearCompare').addEventListener('click', () => { compareList = []; saveCompare(); updateCompareUI(); showToast('Compare list cleared', 'info'); });
        document.getElementById('compareClose').addEventListener('click', () => { document.getElementById('compareModal').classList.remove('active'); document.body.style.overflow = ''; });
        document.getElementById('compareModal').addEventListener('click', function (e) { if (e.target === this) { this.classList.remove('active'); document.body.style.overflow = ''; } });

        // Theme
        document.getElementById('themeToggle').addEventListener('click', function () {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) { document.documentElement.removeAttribute('data-theme'); this.querySelector('i').className = 'fas fa-moon'; theme = 'light'; }
            else { document.documentElement.setAttribute('data-theme', 'dark'); this.querySelector('i').className = 'fas fa-sun'; theme = 'dark'; }
            saveTheme();
        });

        // User avatar
        document.getElementById('userAvatar').addEventListener('click', function (e) {
            e.stopPropagation();
            if (currentUser) showDashboard();
            else openAuthModal('signin');
        });

        // Auth modal
        document.getElementById('authClose').addEventListener('click', closeAuthModal);
        document.getElementById('authModal').addEventListener('click', function (e) { if (e.target === this) closeAuthModal(); });
        document.querySelectorAll('.auth-tabs button').forEach(b => b.addEventListener('click', function () { openAuthModal(this.dataset.tab); }));
        document.getElementById('switchToSignup').addEventListener('click', () => openAuthModal('signup'));
        document.getElementById('switchToSignin').addEventListener('click', () => openAuthModal('signin'));

        // Sign in
        document.getElementById('signinForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('signinEmail').value.trim();
            const pass = document.getElementById('signinPassword').value.trim();
            const users = JSON.parse(localStorage.getItem('furni_users')) || [];
            const found = users.find(u => u.email === email && u.password === pass);
            if (found) {
                currentUser = { name: found.name, email: found.email };
                saveUser();
                updateUserUI();
                closeAuthModal();
                showToast(`Welcome back, ${found.name.split(' ')[0]}!`, 'success');
                this.reset();
            } else showToast('Invalid credentials', 'error');
        });

        // Sign up
        document.getElementById('signupForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const pass = document.getElementById('signupPassword').value.trim();
            if (!name || !email || pass.length < 6) { showToast('Fill all fields (password min 6)', 'error'); return; }
            const users = JSON.parse(localStorage.getItem('furni_users')) || [];
            if (users.find(u => u.email === email)) { showToast('Email already registered', 'error'); return; }
            users.push({ name, email, password: pass });
            localStorage.setItem('furni_users', JSON.stringify(users));
            currentUser = { name, email };
            saveUser();
            updateUserUI();
            closeAuthModal();
            showToast(`Welcome, ${name.split(' ')[0]}!`, 'success');
            this.reset();
            const key = `furni_userdata_${email}`;
            if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ addresses: [], orders: [], phone: '', profile: { name, email } }));
        });

        // Quick view close
        document.getElementById('quickViewClose').addEventListener('click', closeQuickView);
        document.getElementById('quickViewModal').addEventListener('click', function (e) { if (e.target === this) closeQuickView(); });

        // Checkout close
        document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
        document.getElementById('checkoutModal').addEventListener('click', function (e) { if (e.target === this) closeCheckout(); });

        // Image zoom
        document.getElementById('imageZoomOverlay').addEventListener('click', function () { this.classList.remove('active'); });

        // Dashboard
        document.getElementById('logoutSidebarBtn').addEventListener('click', function () {
            currentUser = null;
            localStorage.removeItem('furni_user');
            updateUserUI();
            hideDashboard();
            showToast('Signed out', 'info');
        });

        document.getElementById('mobileSidebarToggle').addEventListener('click', () => {
            document.getElementById('dashboardSidebar').classList.toggle('open');
            document.getElementById('sidebarOverlay').classList.toggle('active');
        });
        document.getElementById('sidebarOverlay').addEventListener('click', () => {
            document.getElementById('dashboardSidebar').classList.remove('open');
            document.getElementById('sidebarOverlay').classList.remove('active');
        });
        document.querySelectorAll('.dashboard-sidebar .nav-item[data-page]').forEach(i => i.addEventListener('click', function () { switchDashboardPage(this.dataset.page); }));

        // Mobile menu
        document.getElementById('hamburgerBtn').addEventListener('click', function () {
            document.getElementById('mobileMenu').classList.toggle('active');
            this.querySelector('i').className = document.getElementById('mobileMenu').classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });
        document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.remove('active');
            document.getElementById('hamburgerBtn').querySelector('i').className = 'fas fa-bars';
        }));

        // Mobile sign in
        document.getElementById('mobileSignIn').addEventListener('click', () => { openAuthModal('signin'); document.getElementById('mobileMenu').classList.remove('active'); });
        document.getElementById('mobileSignUp').addEventListener('click', () => { openAuthModal('signup'); document.getElementById('mobileMenu').classList.remove('active'); });

        // Contact & Newsletter
        document.getElementById('contactForm').addEventListener('submit', function (e) { e.preventDefault(); showToast('Message sent!', 'success'); this.reset(); });
        document.getElementById('newsletterForm').addEventListener('submit', function (e) { e.preventDefault(); showToast('Subscribed!', 'success'); this.reset(); });

        // Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (document.getElementById('cartSidebar').classList.contains('active')) { document.getElementById('cartSidebar').classList.remove('active'); document.getElementById('cartOverlay').classList.remove('active'); }
                if (document.getElementById('authModal').classList.contains('active')) closeAuthModal();
                if (document.getElementById('quickViewModal').classList.contains('active')) closeQuickView();
                if (document.getElementById('checkoutModal').classList.contains('active')) closeCheckout();
                if (document.getElementById('compareModal').classList.contains('active')) { document.getElementById('compareModal').classList.remove('active'); document.body.style.overflow = ''; }
                document.getElementById('imageZoomOverlay').classList.remove('active');
            }
        });

        // Scroll
        window.addEventListener('scroll', function () {
            const st = window.pageYOffset;
            const dh = document.documentElement.scrollHeight - window.innerHeight;
            document.getElementById('scrollProgress').style.width = (dh > 0 ? (st / dh) * 100 : 0) + '%';
            document.getElementById('backToTop').classList.toggle('visible', st > 300);
        });
        document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Flash sale progress
        let prog = 65;
        setInterval(() => {
            if (prog < 95) {
                prog = Math.min(95, prog + Math.random() * 2);
                document.getElementById('flashProgressBar').style.width = prog + '%';
                document.getElementById('flashClaimed').textContent = Math.round(prog) + '% claimed';
            }
        }, 8000);
    }

    // Expose functions
    window.goToStep = goToStep;
    window.saveShipping = saveShipping;
    window.savePayment = savePayment;
    window.placeOrder = placeOrder;
    window.viewOrderTracking = viewOrderTracking;
    window.switchDashboardPage = switchDashboardPage;
    window.closeCheckout = closeCheckout;

    document.addEventListener('DOMContentLoaded', init);
})();
