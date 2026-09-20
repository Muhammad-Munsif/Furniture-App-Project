
    (function() {
        'use strict';

        // ============ DATA (abbreviated) ============
        const FEATURED = [
            { id: 1, name: 'Luxury Velvet Sofa', price: 899.99, oldPrice: 1299.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Elegant velvet with premium cushioning.', rating: 4.8, reviewCount: 124, isNew: true, stock: 15, colors: ['#4a5568', '#2d3748', '#e2e8f0'], sizes: ['2-Seat', '3-Seat'], category: 'living' },
            { id: 2, name: 'Modern Armchair', price: 349.99, oldPrice: 449.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ergonomic design with stylish fabric.', rating: 4.6, reviewCount: 89, stock: 3, colors: ['#2d3748', '#4a5568'], sizes: ['Standard'], category: 'living' },
            { id: 3, name: 'Oak Dining Table', price: 599.99, oldPrice: 799.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Solid oak, extendable for gatherings.', rating: 4.9, reviewCount: 67, isNew: true, stock: 8, colors: ['#d69e2e'], sizes: ['6-Seat'], category: 'dining' },
            { id: 4, name: 'Minimalist Bed Frame', price: 749.99, oldPrice: 999.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Clean lines, sturdy construction.', rating: 4.7, reviewCount: 156, stock: 0, colors: ['#2d3748'], sizes: ['Queen'], category: 'bedroom' }
        ];

        const CATEGORY_PRODUCTS = {
            living: [
                { id: 101, name: 'Sectional Sofa', price: 1299.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Spacious L-shaped sectional.', rating: 4.8, reviewCount: 45, stock: 5, category: 'living' },
                { id: 102, name: 'Coffee Table', price: 299.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Minimalist wood and glass.', rating: 4.5, reviewCount: 32, stock: 12, category: 'living' },
                { id: 103, name: 'TV Stand', price: 449.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern media console.', rating: 4.6, reviewCount: 28, stock: 2, category: 'living' },
                { id: 104, name: 'Accent Chair', price: 249.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Mid-century modern style.', rating: 4.7, reviewCount: 51, stock: 7, category: 'living' },
                { id: 105, name: 'Rug', price: 189.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Wool blend pattern.', rating: 4.4, reviewCount: 19, stock: 20, category: 'living' },
                { id: 106, name: 'Floor Lamp', price: 159.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable arc lamp.', rating: 4.6, reviewCount: 37, stock: 15, category: 'living' },
                { id: 107, name: 'Bookshelf', price: 399.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '5-tier open shelving.', rating: 4.8, reviewCount: 42, stock: 4, category: 'living' },
                { id: 108, name: 'Ottoman', price: 199.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Tufted storage ottoman.', rating: 4.5, reviewCount: 24, stock: 9, category: 'living' },
                { id: 109, name: 'Wall Art', price: 129.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Abstract canvas set.', rating: 4.3, reviewCount: 15, stock: 25, category: 'living' },
                { id: 110, name: 'Pouf', price: 89.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Knitted cotton pouf.', rating: 4.7, reviewCount: 33, stock: 18, category: 'living' }
            ],
            bedroom: [
                { id: 201, name: 'King Bed Frame', price: 999.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Upholstered headboard.', rating: 4.9, reviewCount: 78, stock: 6, category: 'bedroom' },
                { id: 202, name: 'Nightstand', price: 199.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Solid wood with drawers.', rating: 4.6, reviewCount: 41, stock: 14, category: 'bedroom' },
                { id: 203, name: 'Dresser', price: 549.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '6-drawer modern dresser.', rating: 4.7, reviewCount: 36, stock: 3, category: 'bedroom' },
                { id: 204, name: 'Mirror', price: 129.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Floor-length arched mirror.', rating: 4.8, reviewCount: 52, stock: 11, category: 'bedroom' },
                { id: 205, name: 'Bedside Lamp', price: 79.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Dimmable ceramic lamp.', rating: 4.5, reviewCount: 27, stock: 22, category: 'bedroom' },
                { id: 206, name: 'Wardrobe', price: 799.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Sliding door wardrobe.', rating: 4.6, reviewCount: 31, stock: 4, category: 'bedroom' },
                { id: 207, name: 'Bench', price: 249.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Upholstered bench.', rating: 4.7, reviewCount: 22, stock: 7, category: 'bedroom' },
                { id: 208, name: 'Rug', price: 159.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Plush shag rug.', rating: 4.4, reviewCount: 18, stock: 16, category: 'bedroom' },
                { id: 209, name: 'Desk', price: 399.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Compact writing desk.', rating: 4.5, reviewCount: 29, stock: 8, category: 'bedroom' },
                { id: 210, name: 'Pillow Set', price: 89.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 4 pillows.', rating: 4.8, reviewCount: 47, stock: 30, category: 'bedroom' }
            ],
            dining: [
                { id: 301, name: 'Dining Table', price: 899.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Extendable oak table.', rating: 4.8, reviewCount: 54, stock: 5, category: 'dining' },
                { id: 302, name: 'Dining Chair', price: 149.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Mid-century dining chair.', rating: 4.6, reviewCount: 62, stock: 24, category: 'dining' },
                { id: 303, name: 'Sideboard', price: 599.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Buffet with glass doors.', rating: 4.7, reviewCount: 35, stock: 3, category: 'dining' },
                { id: 304, name: 'Bar Stool', price: 129.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable bar stool.', rating: 4.5, reviewCount: 43, stock: 18, category: 'dining' },
                { id: 305, name: 'Table Runner', price: 39.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Linen table runner.', rating: 4.4, reviewCount: 21, stock: 40, category: 'dining' },
                { id: 306, name: 'Dinnerware Set', price: 199.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '16-piece stoneware set.', rating: 4.8, reviewCount: 38, stock: 12, category: 'dining' },
                { id: 307, name: 'Wine Rack', price: 79.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Wall wine rack.', rating: 4.6, reviewCount: 26, stock: 15, category: 'dining' },
                { id: 308, name: 'Chandelier', price: 349.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Glass chandelier.', rating: 4.9, reviewCount: 29, stock: 2, category: 'dining' },
                { id: 309, name: 'Placemat Set', price: 29.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 6 placemats.', rating: 4.3, reviewCount: 17, stock: 50, category: 'dining' },
                { id: 310, name: 'Serving Cart', price: 249.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Steel serving cart.', rating: 4.7, reviewCount: 34, stock: 6, category: 'dining' }
            ],
            office: [
                { id: 401, name: 'Ergonomic Chair', price: 499.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Lumbar support.', rating: 4.9, reviewCount: 88, stock: 8, category: 'office' },
                { id: 402, name: 'Standing Desk', price: 699.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Electric adjustable.', rating: 4.8, reviewCount: 56, stock: 4, category: 'office' },
                { id: 403, name: 'Desk Lamp', price: 89.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'LED task lamp.', rating: 4.6, reviewCount: 42, stock: 20, category: 'office' },
                { id: 404, name: 'Bookshelf', price: 299.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '5-shelf industrial.', rating: 4.7, reviewCount: 37, stock: 7, category: 'office' },
                { id: 405, name: 'Office Drawer', price: 199.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Filing cabinet.', rating: 4.5, reviewCount: 23, stock: 9, category: 'office' },
                { id: 406, name: 'Monitor Stand', price: 59.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable riser.', rating: 4.4, reviewCount: 31, stock: 25, category: 'office' },
                { id: 407, name: 'Desk Mat', price: 39.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Leather mat.', rating: 4.7, reviewCount: 44, stock: 30, category: 'office' },
                { id: 408, name: 'Pen Holder', price: 19.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic organizer.', rating: 4.3, reviewCount: 19, stock: 45, category: 'office' },
                { id: 409, name: 'Wall Organizer', price: 49.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Pegboard.', rating: 4.5, reviewCount: 27, stock: 12, category: 'office' },
                { id: 410, name: 'Footrest', price: 69.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ergonomic footrest.', rating: 4.6, reviewCount: 35, stock: 14, category: 'office' }
            ],
            lighting: [
                { id: 501, name: 'Pendant Light', price: 199.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Brass pendant.', rating: 4.8, reviewCount: 46, stock: 10, category: 'lighting' },
                { id: 502, name: 'Floor Lamp', price: 149.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Tripod lamp.', rating: 4.6, reviewCount: 38, stock: 8, category: 'lighting' },
                { id: 503, name: 'Table Lamp', price: 89.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic table lamp.', rating: 4.7, reviewCount: 52, stock: 16, category: 'lighting' },
                { id: 504, name: 'Wall Sconce', price: 79.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 2.', rating: 4.5, reviewCount: 29, stock: 20, category: 'lighting' },
                { id: 505, name: 'Chandelier', price: 599.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Crystal chandelier.', rating: 4.9, reviewCount: 24, stock: 2, category: 'lighting' },
                { id: 506, name: 'Desk Lamp', price: 69.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Architect lamp.', rating: 4.6, reviewCount: 41, stock: 13, category: 'lighting' },
                { id: 507, name: 'String Lights', price: 39.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Indoor string.', rating: 4.4, reviewCount: 33, stock: 40, category: 'lighting' },
                { id: 508, name: 'Lantern', price: 59.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Outdoor lantern.', rating: 4.5, reviewCount: 22, stock: 18, category: 'lighting' },
                { id: 509, name: 'Spotlight', price: 49.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable spot.', rating: 4.3, reviewCount: 18, stock: 22, category: 'lighting' },
                { id: 510, name: 'Night Light', price: 29.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Smart night light.', rating: 4.7, reviewCount: 51, stock: 35, category: 'lighting' }
            ],
            decor: [
                { id: 601, name: 'Vase', price: 49.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic vase set.', rating: 4.6, reviewCount: 28, stock: 25, category: 'decor' },
                { id: 602, name: 'Wall Art', price: 89.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Abstract painting.', rating: 4.7, reviewCount: 35, stock: 14, category: 'decor' },
                { id: 603, name: 'Candle Set', price: 39.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Scented candles.', rating: 4.8, reviewCount: 62, stock: 30, category: 'decor' },
                { id: 604, name: 'Mirror', price: 149.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Round mirror.', rating: 4.9, reviewCount: 47, stock: 9, category: 'decor' },
                { id: 605, name: 'Throw Blanket', price: 69.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Woven throw.', rating: 4.7, reviewCount: 39, stock: 20, category: 'decor' },
                { id: 606, name: 'Cushion Cover', price: 29.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 2.', rating: 4.5, reviewCount: 44, stock: 40, category: 'decor' },
                { id: 607, name: 'Plant Pot', price: 34.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Terracotta pot.', rating: 4.6, reviewCount: 31, stock: 28, category: 'decor' },
                { id: 608, name: 'Sculpture', price: 119.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern sculpture.', rating: 4.8, reviewCount: 23, stock: 6, category: 'decor' },
                { id: 609, name: 'Photo Frame', price: 24.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 3 frames.', rating: 4.4, reviewCount: 26, stock: 50, category: 'decor' },
                { id: 610, name: 'Decorative Tray', price: 44.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Gold tray.', rating: 4.7, reviewCount: 33, stock: 18, category: 'decor' }
            ]
        };

        const COUPONS = {
            'WELCOME10': { type: 'percent', value: 10, minOrder: 0, desc: '10% off' },
            'SAVE20': { type: 'fixed', value: 20, minOrder: 200, desc: '$20 off' },
            'FREESHIP': { type: 'shipping', value: 0, minOrder: 0, desc: 'Free shipping' },
            'FLASH40': { type: 'percent', value: 40, minOrder: 0, desc: '40% off' }
        };

        const REVIEWS_DATA = [
            { id: 1, name: 'Sarah Johnson', initials: 'SJ', rating: 5, date: '2 weeks ago', title: 'Absolutely stunning!', text: 'The velvet sofa exceeded all my expectations.', verified: true },
            { id: 2, name: 'Michael Chen', initials: 'MC', rating: 5, date: '1 month ago', title: 'Premium quality', text: 'You can tell this is high-quality furniture.', verified: true },
            { id: 3, name: 'Emily Rodriguez', initials: 'ER', rating: 4, date: '3 weeks ago', title: 'Great value', text: 'Beautiful piece for the price.', verified: true },
            { id: 4, name: 'David Kim', initials: 'DK', rating: 5, date: '2 months ago', title: 'Perfect addition', text: 'Exactly what I was looking for.', verified: true }
        ];

        // ============ STATE ============
        let currentUser = JSON.parse(localStorage.getItem('furni_user')) || null;
        let cart = JSON.parse(localStorage.getItem('furni_cart')) || [];
        let wishlist = JSON.parse(localStorage.getItem('furni_wishlist')) || [];
        let compareList = JSON.parse(localStorage.getItem('furni_compare')) || [];
        let recentlyViewed = JSON.parse(localStorage.getItem('furni_recently_viewed')) || [];
        let theme = localStorage.getItem('furni_theme') || 'light';
        let appliedCoupon = null;
        let quickViewQty = 1;
        let checkoutStep = 1;
        let checkoutData = { shipping: {}, payment: {} };

        // ============ HELPERS ============
        const $ = s => document.querySelector(s);
        const $$ = s => document.querySelectorAll(s);

        function saveAll() {
            localStorage.setItem('furni_cart', JSON.stringify(cart));
            localStorage.setItem('furni_wishlist', JSON.stringify(wishlist));
            localStorage.setItem('furni_compare', JSON.stringify(compareList));
            localStorage.setItem('furni_recently_viewed', JSON.stringify(recentlyViewed));
            localStorage.setItem('furni_theme', theme);
            if (currentUser) localStorage.setItem('furni_user', JSON.stringify(currentUser));
        }

        function showToast(msg, type = 'success', actionText = null, actionFn = null) {
            const c = document.getElementById('toastContainer');
            const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
            const t = document.createElement('div');
            t.className = `toast-item ${type}`;
            t.innerHTML = `<i class="fas ${icons[type]} toast-icon"></i><span class="toast-msg">${msg}</span>${actionText ? `<button class="toast-action">${actionText}</button>` : ''}`;
            if (actionText && actionFn) t.querySelector('.toast-action').addEventListener('click', () => { actionFn(); dismissToast(t); });
            c.appendChild(t);
            setTimeout(() => dismissToast(t), 3200);
        }
        function dismissToast(t) { if (!t.parentNode) return; t.classList.add('leaving'); setTimeout(() => t.remove(), 300); }

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
                const f = CATEGORY_PRODUCTS[cat].find(x => x.id === id);
                if (f) return f;
            }
            return null;
        }
        function getAllProducts() { let all = [...FEATURED]; for (let cat in CATEGORY_PRODUCTS) all = all.concat(CATEGORY_PRODUCTS[cat]); return all; }

        function getStockStatus(stock) {
            if (stock === 0) return { class: 'out-of-stock', label: 'Out of Stock' };
            if (stock <= 5) return { class: 'low-stock', label: `Only ${stock} left!` };
            return { class: 'in-stock', label: 'In Stock' };
        }
        function getUserPoints() { if (!currentUser) return 0; return parseInt(localStorage.getItem(`furni_loyalty_${currentUser.email}`)) || 0; }
        function addPoints(amount) { if (!currentUser) return; const key = `furni_loyalty_${currentUser.email}`; const cur = parseInt(localStorage.getItem(key)) || 0; localStorage.setItem(key, cur + amount); }
        function getTier(points) {
            if (points >= 10000) return { name: 'Platinum', icon: '💎', next: null };
            if (points >= 5000) return { name: 'Gold', icon: '🥇', next: 10000 };
            if (points >= 1000) return { name: 'Silver', icon: '🥈', next: 5000 };
            return { name: 'Bronze', icon: '🥉', next: 1000 };
        }

        function animateCounter(el, target, duration = 1200, isPrice = false) {
            if (!el) return;
            const targetNum = typeof target === 'string' ? parseFloat(target.replace(/[$,]/g, '')) : target;
            const startTime = performance.now();
            function update(currentTime) {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = targetNum * eased;
                el.textContent = isPrice ? '$' + Math.round(current).toLocaleString() : Math.round(current).toLocaleString();
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = isPrice ? '$' + targetNum.toLocaleString() : targetNum.toLocaleString();
            }
            requestAnimationFrame(update);
        }

        function createConfetti() {
            const container = document.getElementById('confettiContainer');
            const colors = ['#2b6cb0', '#38a169', '#d69e2e', '#7c3aed', '#e53e3e', '#f6ad55'];
            for (let i = 0; i < 60; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                confetti.style.width = confetti.style.height = (Math.random() * 8 + 6) + 'px';
                if (Math.random() > 0.5) confetti.style.borderRadius = '50%';
                container.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }
        }

        function initScrollReveal() {
            const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('revealed'); });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
            reveals.forEach(el => observer.observe(el));
        }

        function initHeroParticles() {
            const container = document.getElementById('heroParticles');
            if (!container) return;
            for (let i = 0; i < 8; i++) {
                const p = document.createElement('div');
                p.className = 'hero-particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.top = Math.random() * 100 + '%';
                p.style.width = p.style.height = (Math.random() * 60 + 30) + 'px';
                p.style.animationDelay = Math.random() * 3 + 's';
                p.style.animationDuration = (Math.random() * 4 + 5) + 's';
                container.appendChild(p);
            }
        }

        function addRippleEffect(el) {
            el.classList.add('ripple');
            el.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 700);
            });
        }

        // ============ RENDER ============
        function renderProductGrid(products, container) {
            if (!container) return;
            container.innerHTML = products.map((p, idx) => {
                const inWish = wishlist.includes(p.id);
                const inComp = compareList.includes(p.id);
                const isNew = p.isNew || false;
                const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
                const stockStatus = getStockStatus(p.stock || 10);
                const isOut = p.stock === 0;
                return `
                <div class="product-card" data-id="${p.id}" style="animation-delay:${idx * 0.06}s">
                    <div class="product-image-wrapper">
                        ${isNew ? '<span class="sale-badge badge-new">New</span>' : ''}
                        ${discount > 0 && !isNew ? `<span class="sale-badge badge-sale">-${discount}%</span>` : ''}
                        <span class="stock-badge ${stockStatus.class}">${stockStatus.label}</span>
                        <button class="compare-btn ${inComp ? 'active' : ''}" data-id="${p.id}"><i class="fas fa-balance-scale"></i></button>
                        <button class="wishlist-btn ${inWish ? 'active' : ''}" data-id="${p.id}"><i class="fas fa-heart"></i></button>
                        <img src="${p.image}" alt="${p.name}" loading="lazy">
                        <div class="quick-view-overlay">
                            <button class="quick-view-trigger" data-id="${p.id}"><i class="fas fa-eye"></i> Quick View</button>
                        </div>
                    </div>
                    <div class="product-body">
                        <h3 class="quick-view-trigger" data-id="${p.id}">${p.name}</h3>
                        <div class="product-rating"><span class="stars">${getStars(p.rating || 4.5)}</span><span>(${p.reviewCount || 0})</span></div>
                        <div class="desc">${p.desc}</div>
                        <div class="product-price-row">
                            <span class="price">$${p.price.toFixed(2)}</span>
                            ${p.oldPrice ? `<span class="old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-small ${isOut ? 'btn-outline' : 'btn-success'} add-cart" data-id="${p.id}" ${isOut ? 'disabled' : ''}><i class="fas fa-${isOut ? 'times' : 'plus'}"></i> ${isOut ? 'Out' : 'Add'}</button>
                            <button class="btn btn-small btn-outline quick-view-trigger" data-id="${p.id}"><i class="fas fa-eye"></i></button>
                        </div>
                    </div>
                </div>`;
            }).join('');

            container.querySelectorAll('.add-cart').forEach(b => b.addEventListener('click', function(e) { e.stopPropagation(); if (!this.disabled) addToCart(parseInt(this.dataset.id)); }));
            container.querySelectorAll('.wishlist-btn').forEach(b => b.addEventListener('click', function(e) { e.stopPropagation(); toggleWishlist(parseInt(this.dataset.id)); }));
            container.querySelectorAll('.compare-btn').forEach(b => b.addEventListener('click', function(e) { e.stopPropagation(); toggleCompare(parseInt(this.dataset.id)); }));
            container.querySelectorAll('.quick-view-trigger').forEach(b => b.addEventListener('click', function(e) { e.stopPropagation(); openQuickView(parseInt(this.dataset.id)); }));
        }

        // ============ CART ============
        function addToCart(id, qty = 1) {
            if (!currentUser) { showToast('Please sign in first', 'warning'); openAuthModal('signin'); return; }
            const p = findProductById(id);
            if (!p || p.stock === 0) return;
            const ex = cart.find(i => i.id === id);
            if (ex) ex.qty += qty; else cart.push({ id, name: p.name, price: p.price, image: p.image, qty });
            saveAll(); updateCartUI(); addToRecentlyViewed(id);
            showToast(`${p.name} added!`, 'success', 'View Cart', () => {
                document.getElementById('cartSidebar').classList.add('active');
                document.getElementById('cartOverlay').classList.add('active');
            });
        }

        function updateCartUI() {
            const count = cart.reduce((s, i) => s + i.qty, 0);
            const badge = document.getElementById('cartCount');
            badge.textContent = count;
            badge.classList.toggle('hidden', count === 0);
            const itemsEl = document.getElementById('cartItems');
            const footerEl = document.getElementById('cartFooter');
            if (cart.length === 0) {
                itemsEl.innerHTML = '<div class="cart-empty"><i class="fas fa-box-open"></i><p>Your cart is empty</p></div>';
                footerEl.style.display = 'none';
                return;
            }
            itemsEl.innerHTML = cart.map(i => `
                <div class="cart-item">
                    <img src="${i.image}" alt="${i.name}">
                    <div class="cart-item-info">
                        <h4>${i.name}</h4>
                        <div class="price">$${i.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <button class="qty-dec" data-id="${i.id}">−</button>
                            <span>${i.qty}</span>
                            <button class="qty-inc" data-id="${i.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${i.id}"><i class="fas fa-times"></i></button>
                </div>
            `).join('');
            itemsEl.querySelectorAll('.qty-dec').forEach(b => b.addEventListener('click', function() { updateQty(parseInt(this.dataset.id), -1); }));
            itemsEl.querySelectorAll('.qty-inc').forEach(b => b.addEventListener('click', function() { updateQty(parseInt(this.dataset.id), 1); }));
            itemsEl.querySelectorAll('.cart-item-remove').forEach(b => b.addEventListener('click', function() { removeFromCart(parseInt(this.dataset.id)); }));
            const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
            document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
            footerEl.style.display = 'block';
        }
        function updateQty(id, delta) { const item = cart.find(i => i.id === id); if (!item) return; item.qty += delta; if (item.qty <= 0) return removeFromCart(id); saveAll(); updateCartUI(); }
        function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveAll(); updateCartUI(); showToast('Item removed', 'info'); }

        // ============ WISHLIST & COMPARE ============
        function toggleWishlist(id) {
            const idx = wishlist.indexOf(id);
            if (idx > -1) { wishlist.splice(idx, 1); showToast('Removed from wishlist', 'info'); }
            else { wishlist.push(id); showToast('Added to wishlist!', 'success'); }
            saveAll(); updateWishlistUI();
        }
        function updateWishlistUI() {
            const count = wishlist.length;
            const badge = document.getElementById('wishlistCount');
            badge.textContent = count;
            badge.classList.toggle('hidden', count === 0);
            document.querySelectorAll('.wishlist-btn').forEach(b => b.classList.toggle('active', wishlist.includes(parseInt(b.dataset.id))));
        }
        function toggleCompare(id) {
            const idx = compareList.indexOf(id);
            if (idx > -1) { compareList.splice(idx, 1); showToast('Removed from compare', 'info'); }
            else { if (compareList.length >= 4) { showToast('Max 4 products', 'warning'); return; } compareList.push(id); showToast('Added to compare', 'success'); }
            saveAll(); updateCompareUI();
        }
        function updateCompareUI() {
            const count = compareList.length;
            const badge = document.getElementById('compareCount');
            badge.textContent = count;
            badge.classList.toggle('hidden', count === 0);
            document.querySelectorAll('.compare-btn').forEach(b => b.classList.toggle('active', compareList.includes(parseInt(b.dataset.id))));
            const bar = document.getElementById('compareBar');
            const items = document.getElementById('compareItems');
            if (compareList.length > 0) {
                bar.classList.add('active');
                items.innerHTML = compareList.map(id => {
                    const p = findProductById(id);
                    if (!p) return '';
                    return `<div class="compare-item"><img src="${p.image}" alt=""><span>${p.name.length > 14 ? p.name.slice(0, 14) + '...' : p.name}</span><button class="remove-compare" data-id="${id}"><i class="fas fa-times"></i></button></div>`;
                }).join('');
                items.querySelectorAll('.remove-compare').forEach(b => b.addEventListener('click', () => toggleCompare(parseInt(b.dataset.id))));
            } else bar.classList.remove('active');
        }

        // ============ RECENTLY VIEWED ============
        function addToRecentlyViewed(id) {
            recentlyViewed = recentlyViewed.filter(x => x !== id);
            recentlyViewed.unshift(id);
            if (recentlyViewed.length > 6) recentlyViewed = recentlyViewed.slice(0, 6);
            saveAll(); renderRecentlyViewed();
        }
        function renderRecentlyViewed() {
            if (recentlyViewed.length === 0) { document.getElementById('recentlyViewed').style.display = 'none'; return; }
            document.getElementById('recentlyViewed').style.display = 'block';
            renderProductGrid(recentlyViewed.map(id => findProductById(id)).filter(Boolean), document.getElementById('recentlyViewedGrid'));
        }

        // ============ CATEGORY PAGE ============
        function showCategoryPage(cat) {
            const products = CATEGORY_PRODUCTS[cat];
            if (!products || products.length === 0) { showToast('No products', 'warning'); return; }
            document.getElementById('mainSections').style.display = 'none';
            document.querySelector('.newsletter-section').style.display = 'none';
            document.querySelector('.main-footer').style.display = 'none';
            document.getElementById('dashboardWrapper').classList.remove('active');
            document.getElementById('categoryPage').classList.add('active');
            const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
            document.getElementById('categoryPageTitle').innerHTML = `${displayName} <span>Collection</span>`;
            document.getElementById('categoryPageMeta').textContent = `${products.length} products available`;
            const grid = document.getElementById('categoryProductGrid');
            grid.innerHTML = '';
            renderProductGrid(products, grid);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        function hideCategoryPage() {
            document.getElementById('categoryPage').classList.remove('active');
            document.getElementById('mainSections').style.display = '';
            document.querySelector('.newsletter-section').style.display = '';
            document.querySelector('.main-footer').style.display = '';
            document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
        }

        // ============ QUICK VIEW ============
        function openQuickView(id) {
            const p = findProductById(id);
            if (!p) return;
            quickViewQty = 1;
            const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
            const stockStatus = getStockStatus(p.stock || 10);
            document.getElementById('quickViewBody').innerHTML = `
                <div><img src="${p.image}" alt="${p.name}" class="quick-view-main-image"></div>
                <div class="quick-view-details">
                    <h2>${p.name}</h2>
                    <div class="quick-view-rating">
                        <span class="stars">${getStars(p.rating || 4.5)}</span>
                        <span>${p.rating || 4.5} · ${p.reviewCount || 0} reviews</span>
                        <span class="stock-badge ${stockStatus.class}" style="position:static;">${stockStatus.label}</span>
                    </div>
                    <div class="quick-view-price">
                        <span class="current">$${p.price.toFixed(2)}</span>
                        ${p.oldPrice ? `<span class="old">$${p.oldPrice.toFixed(2)}</span>` : ''}
                        ${discount > 0 ? `<span class="discount">-${discount}% OFF</span>` : ''}
                    </div>
                    <div class="quick-view-desc">${p.desc}</div>
                    ${p.colors ? `<div class="quick-view-option"><label>Color</label><div class="color-options">${p.colors.map((c, i) => `<div class="color-option ${i === 0 ? 'active' : ''}" style="background:${c}"></div>`).join('')}</div></div>` : ''}
                    ${p.sizes ? `<div class="quick-view-option"><label>Size</label><div class="size-options">${p.sizes.map((s, i) => `<div class="size-option ${i === 0 ? 'active' : ''}">${s}</div>`).join('')}</div></div>` : ''}
                    <div class="quick-view-actions">
                        <div class="qty-selector"><button id="qvQtyDec">−</button><span id="qvQty">1</span><button id="qvQtyInc">+</button></div>
                        <button class="btn ${p.stock === 0 ? 'btn-outline' : ''}" id="qvAddToCart" ${p.stock === 0 ? 'disabled' : ''}><i class="fas fa-shopping-bag"></i> ${p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</button>
                        <button class="btn btn-outline" id="qvWishlist"><i class="fas fa-heart"></i></button>
                        <button class="btn btn-outline" id="qvCompare"><i class="fas fa-balance-scale"></i></button>
                    </div>
                    <div class="quick-view-share">
                        <button class="share-btn" data-share="copy"><i class="fas fa-link"></i></button>
                        <button class="share-btn" data-share="facebook"><i class="fab fa-facebook-f"></i></button>
                        <button class="share-btn" data-share="twitter"><i class="fab fa-twitter"></i></button>
                        <button class="share-btn" data-share="whatsapp"><i class="fab fa-whatsapp"></i></button>
                    </div>
                </div>
            `;
            document.getElementById('quickViewModal').classList.add('active');
            document.body.style.overflow = 'hidden';
            addToRecentlyViewed(id);
            document.getElementById('qvQtyDec').addEventListener('click', () => { if (quickViewQty > 1) { quickViewQty--; document.getElementById('qvQty').textContent = quickViewQty; } });
            document.getElementById('qvQtyInc').addEventListener('click', () => { quickViewQty++; document.getElementById('qvQty').textContent = quickViewQty; });
            document.getElementById('qvAddToCart').addEventListener('click', () => { if (p.stock > 0) { addToCart(id, quickViewQty); closeQuickView(); } });
            document.getElementById('qvWishlist').addEventListener('click', function() { toggleWishlist(id); this.style.color = wishlist.includes(id) ? 'var(--danger)' : ''; });
            document.getElementById('qvCompare').addEventListener('click', function() { toggleCompare(id); this.style.color = compareList.includes(id) ? 'var(--primary)' : ''; });
            document.querySelectorAll('#quickViewBody .color-option').forEach(o => o.addEventListener('click', function() {
                document.querySelectorAll('#quickViewBody .color-option').forEach(x => x.classList.remove('active'));
                this.classList.add('active');
            }));
            document.querySelectorAll('#quickViewBody .size-option').forEach(o => o.addEventListener('click', function() {
                document.querySelectorAll('#quickViewBody .size-option').forEach(x => x.classList.remove('active'));
                this.classList.add('active');
            }));
            document.querySelectorAll('#quickViewBody .share-btn').forEach(b => b.addEventListener('click', function() { shareProduct(p, this.dataset.share); }));
        }

        function closeQuickView() { document.getElementById('quickViewModal').classList.remove('active'); document.body.style.overflow = ''; }

        function shareProduct(p, type) {
            const url = window.location.href.split('#')[0] + '#product-' + p.id;
            const text = `Check out ${p.name}!`;
            if (type === 'copy') { navigator.clipboard.writeText(url).catch(() => {}); showToast('Link copied!', 'success'); }
            else if (type === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            else if (type === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            else if (type === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        }

        // ============ COMPARE MODAL ============
        function openCompareModal() {
            if (compareList.length < 2) { showToast('Add at least 2 products', 'warning'); return; }
            const products = compareList.map(id => findProductById(id)).filter(Boolean);
            const lowPrice = Math.min(...products.map(p => p.price));
            const highRating = Math.max(...products.map(p => p.rating || 0));
            document.getElementById('compareGrid').innerHTML = `
                <div class="compare-grid">
                    <table>
                        <thead><tr><th></th>${products.map(p => `<th class="product-cell"><img src="${p.image}" alt=""><h4 style="font-size:0.85rem;">${p.name}</h4><div style="color:var(--primary);font-weight:700;">$${p.price.toFixed(2)}</div></th>`).join('')}</tr></thead>
                        <tbody>
                            <tr><th>Price</th>${products.map(p => `<td class="${p.price === lowPrice ? 'compare-best' : ''}">$${p.price.toFixed(2)}</td>`).join('')}</tr>
                            <tr><th>Rating</th>${products.map(p => `<td class="${p.rating === highRating ? 'compare-best' : ''}">${p.rating} ★</td>`).join('')}</tr>
                            <tr><th>Reviews</th>${products.map(p => `<td>${p.reviewCount}</td>`).join('')}</tr>
                            <tr><th>Stock</th>${products.map(p => `<td>${p.stock > 0 ? p.stock + ' units' : 'Out'}</td>`).join('')}</tr>
                        </tbody>
                    </table>
                </div>
            `;
            document.getElementById('compareModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // ============ RECOMMENDATIONS ============
        function renderRecommendations(tab = 'trending') {
            const all = getAllProducts();
            let products;
            if (tab === 'trending') products = all.filter(p => p.rating >= 4.6).slice(0, 8);
            else if (tab === 'bestsellers') products = [...all].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 8);
            else if (tab === 'deals') products = all.filter(p => p.oldPrice).slice(0, 8);
            else products = all.sort(() => Math.random() - 0.5).slice(0, 8);
            renderProductGrid(products, document.getElementById('recommendationsGrid'));
        }

        // ============ AUTH ============
        function openAuthModal(tab = 'signin') {
            document.getElementById('authModal').classList.add('active');
            document.querySelectorAll('.auth-tabs button').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.toggle('active', f.id === (tab === 'signin' ? 'formSignin' : 'formSignup')));
            document.body.style.overflow = 'hidden';
        }
        function closeAuthModal() { document.getElementById('authModal').classList.remove('active'); document.body.style.overflow = ''; }

        function updateUserUI() {
            const nameEl = document.getElementById('userNameDisplay');
            const avatar = document.getElementById('userAvatar');
            const dashNav = document.getElementById('dashboardNavItem');
            const mobileDash = document.getElementById('mobileDashboardNav');
            const adminNav = document.getElementById('adminNavItem');
            const mobileAdmin = document.getElementById('mobileAdminNav');
            const isAdmin = currentUser && currentUser.email === 'admin@furnicraft.com';
            if (currentUser) {
                const name = currentUser.name.split(' ')[0];
                nameEl.textContent = name;
                avatar.innerHTML = `<i class="fas fa-user-circle"></i><span>${name}</span>`;
                dashNav.style.display = 'block'; mobileDash.style.display = 'block';
                adminNav.style.display = isAdmin ? 'block' : 'none';
                mobileAdmin.style.display = isAdmin ? 'block' : 'none';
            } else {
                nameEl.textContent = 'Sign in';
                avatar.innerHTML = `<i class="fas fa-user-circle"></i><span>Sign in</span>`;
                dashNav.style.display = 'none'; mobileDash.style.display = 'none';
                adminNav.style.display = 'none'; mobileAdmin.style.display = 'none';
            }
        }

        // ============ DASHBOARD ============
        function showDashboard() {
            if (!currentUser) { showToast('Please sign in', 'warning'); openAuthModal('signin'); return; }
            document.getElementById('mainSections').style.display = 'none';
            document.querySelector('.newsletter-section').style.display = 'none';
            document.querySelector('.main-footer').style.display = 'none';
            document.getElementById('categoryPage').classList.remove('active');
            document.getElementById('dashboardWrapper').classList.add('active');
            loadDashboard();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(initScrollReveal, 100);
        }

        function hideDashboard() {
            document.getElementById('dashboardWrapper').classList.remove('active');
            document.getElementById('mainSections').style.display = '';
            document.querySelector('.newsletter-section').style.display = '';
            document.querySelector('.main-footer').style.display = '';
        }

        function loadDashboard() {
            const key = `furni_userdata_${currentUser.email}`;
            const userData = JSON.parse(localStorage.getItem(key)) || { addresses: [], orders: [], phone: '', profile: {} };
            document.getElementById('sidebarUserName').textContent = currentUser.name;
            document.getElementById('sidebarUserEmail').textContent = currentUser.email;
            document.getElementById('dashGreeting').textContent = currentUser.name.split(' ')[0];
            const spent = (userData.orders || []).reduce((s, o) => s + (o.total || 0), 0);
            const points = getUserPoints();
            animateCounter(document.getElementById('dashStatOrders'), (userData.orders || []).length);
            animateCounter(document.getElementById('dashStatPoints'), points);
            animateCounter(document.getElementById('dashStatWishlist'), wishlist.length);
            animateCounter(document.getElementById('statOrders'), (userData.orders || []).length);
            animateCounter(document.getElementById('statSpent'), '$' + Math.round(spent), 1200, true);
            animateCounter(document.getElementById('statPoints'), points);
            animateCounter(document.getElementById('statWishlist'), wishlist.length);
            renderDashboardPage('overview');
        }

        function renderDashboardPage(page) {
            const content = document.getElementById('dashboardPages');
            const userData = JSON.parse(localStorage.getItem(`furni_userdata_${currentUser.email}`)) || { addresses: [], orders: [], phone: '', profile: {} };

            if (page === 'overview') {
                const points = getUserPoints();
                const tier = getTier(points);
                const progress = tier.next ? Math.min(100, (points / tier.next) * 100) : 100;
                const chartData = [40, 65, 50, 80, 60, 90, 75];
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                content.innerHTML = `
                    <div class="content-grid" style="margin-bottom:1.2rem;">
                        <div class="content-card">
                            <div class="card-header"><h3><i class="fas fa-chart-line"></i> Spending Overview</h3><span class="card-action">Last 7 days</span></div>
                            <div class="mini-chart">${chartData.map((v, i) => `<div class="bar" style="height:${v}%; animation-delay:${i * 0.08}s;" data-value="$${v}"></div>`).join('')}</div>
                            <div style="display:flex;justify-content:space-between;font-size:0.68rem;color:var(--text-muted);margin-top:0.5rem;">${days.map(d => `<span>${d}</span>`).join('')}</div>
                        </div>
                        <div class="loyalty-card-modern">
                            <div class="loyalty-content">
                                <div class="loyalty-tier">${tier.icon} ${tier.name} Member</div>
                                <div class="loyalty-points">${points.toLocaleString()}<span class="label">points</span></div>
                                <div class="loyalty-progress-wrap">
                                    <div class="loyalty-progress-label"><span>${tier.name}</span><span>${tier.next ? (tier.next - points).toLocaleString() + ' pts to go' : 'Max tier!'}</span></div>
                                    <div class="loyalty-progress"><div class="loyalty-progress-bar" style="width:${progress}%"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content-card" style="grid-column:1/-1;">
                        <div class="card-header"><h3><i class="fas fa-history"></i> Recent Orders</h3><span class="card-action" onclick="switchDashboardPage('orders')">View All <i class="fas fa-arrow-right"></i></span></div>
                        ${(userData.orders || []).length === 0 ? '<div class="empty-state"><i class="fas fa-shopping-bag"></i><p>No orders yet — start shopping to see them here!</p></div>' : `
                            <div class="order-timeline-list">
                                ${userData.orders.slice(0, 4).map(o => {
                                    const statusClass = o.status === 'delivered' ? 'delivered' : o.status === 'shipped' ? 'shipped' : 'processing';
                                    const statusIcon = o.status === 'delivered' ? 'fa-check' : o.status === 'shipped' ? 'fa-truck' : 'fa-cog';
                                    return `<div class="timeline-order">
                                        <div class="order-status-dot ${statusClass}"><i class="fas ${statusIcon}"></i></div>
                                        <div class="order-info">
                                            <div class="id">Order #${o.id}</div>
                                            <div class="meta">${new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${o.items} items</div>
                                        </div>
                                        <div class="order-total">$${o.total.toFixed(2)}</div>
                                    </div>`;
                                }).join('')}
                            </div>`}
                    </div>
                `;
            } else if (page === 'orders') {
                content.innerHTML = `
                    <div class="dash-page-header">
                        <div><h2><i class="fas fa-history"></i> Order History</h2><p>View and track all your orders</p></div>
                    </div>
                    <div class="content-card">
                        ${(userData.orders || []).length === 0 ? '<div class="empty-state"><i class="fas fa-shopping-bag"></i><p>No orders yet</p></div>' : `
                            <div class="order-timeline-list">
                                ${userData.orders.map(o => {
                                    const statusClass = o.status === 'delivered' ? 'delivered' : o.status === 'shipped' ? 'shipped' : 'processing';
                                    const statusIcon = o.status === 'delivered' ? 'fa-check' : o.status === 'shipped' ? 'fa-truck' : 'fa-cog';
                                    return `<div class="timeline-order">
                                        <div class="order-status-dot ${statusClass}"><i class="fas ${statusIcon}"></i></div>
                                        <div class="order-info">
                                            <div class="id">Order #${o.id}</div>
                                            <div class="meta">${new Date(o.date).toLocaleDateString()} · ${o.items} items</div>
                                        </div>
                                        <div style="display:flex;align-items:center;gap:0.6rem;">
                                            <div class="order-total">$${o.total.toFixed(2)}</div>
                                            <button class="btn btn-small btn-outline track-order" data-id="${o.id}"><i class="fas fa-truck"></i> Track</button>
                                        </div>
                                    </div>`;
                                }).join('')}
                            </div>`}
                    </div>
                `;
                content.querySelectorAll('.track-order').forEach(b => b.addEventListener('click', function() { trackOrder(this.dataset.id); }));
            } else if (page === 'addresses') {
                content.innerHTML = `
                    <div class="dash-page-header"><div><h2><i class="fas fa-map-pin"></i> My Addresses</h2><p>Manage your delivery addresses</p></div></div>
                    <div class="content-card">
                        ${(userData.addresses || []).length === 0 ? '<div class="empty-state"><i class="fas fa-map-pin"></i><p>No addresses saved</p></div>' : userData.addresses.map(a => `<div style="padding:0.9rem;background:var(--surface-2);border-radius:12px;margin-bottom:0.6rem;font-size:0.85rem;border:1px solid var(--border);"><strong>${a.label || 'Address'}</strong><br>${a.street}, ${a.city}, ${a.state} ${a.zip}</div>`).join('')}
                    </div>
                `;
            } else if (page === 'loyalty') {
                const points = getUserPoints();
                const tier = getTier(points);
                const progress = tier.next ? Math.min(100, (points / tier.next) * 100) : 100;
                content.innerHTML = `
                    <div class="dash-page-header"><div><h2><i class="fas fa-coins"></i> Rewards</h2><p>Earn points, unlock rewards</p></div></div>
                    <div class="content-grid">
                        <div class="loyalty-card-modern" style="grid-column:1/-1;">
                            <div class="loyalty-content">
                                <div class="loyalty-tier">${tier.icon} ${tier.name} Member</div>
                                <div class="loyalty-points">${points.toLocaleString()}<span class="label">reward points</span></div>
                                <div class="loyalty-progress-wrap">
                                    <div class="loyalty-progress-label"><span>${tier.name}</span><span>${tier.next ? (tier.next - points).toLocaleString() + ' pts to next tier' : 'Maximum tier reached!'}</span></div>
                                    <div class="loyalty-progress"><div class="loyalty-progress-bar" style="width:${progress}%"></div></div>
                                </div>
                            </div>
                        </div>
                        <div class="content-card">
                            <div class="card-header"><h3><i class="fas fa-star"></i> How to Earn</h3></div>
                            <div style="display:flex;flex-direction:column;gap:0.7rem;">
                                <div style="display:flex;align-items:center;gap:0.7rem;padding:0.7rem;background:var(--surface-2);border-radius:10px;">
                                    <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#2b6cb0,#3182ce);display:flex;align-items:center;justify-content:center;color:#fff;"><i class="fas fa-shopping-bag"></i></div>
                                    <div><div style="font-weight:600;font-size:0.85rem;">Shop</div><div style="font-size:0.75rem;color:var(--text-muted);">10 points per $1</div></div>
                                </div>
                                <div style="display:flex;align-items:center;gap:0.7rem;padding:0.7rem;background:var(--surface-2);border-radius:10px;">
                                    <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#d69e2e,#f6ad55);display:flex;align-items:center;justify-content:center;color:#fff;"><i class="fas fa-star"></i></div>
                                    <div><div style="font-weight:600;font-size:0.85rem;">Write Reviews</div><div style="font-size:0.75rem;color:var(--text-muted);">50 points each</div></div>
                                </div>
                                <div style="display:flex;align-items:center;gap:0.7rem;padding:0.7rem;background:var(--surface-2);border-radius:10px;">
                                    <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#38a169,#48bb78);display:flex;align-items:center;justify-content:center;color:#fff;"><i class="fas fa-user-plus"></i></div>
                                    <div><div style="font-weight:600;font-size:0.85rem;">Refer Friends</div><div style="font-size:0.75rem;color:var(--text-muted);">500 points per referral</div></div>
                                </div>
                            </div>
                        </div>
                        <div class="content-card">
                            <div class="card-header"><h3><i class="fas fa-gift"></i> Available Rewards</h3></div>
                            <div style="display:flex;flex-direction:column;gap:0.6rem;">
                                <div style="padding:0.8rem;background:var(--surface-2);border-radius:10px;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                                    <div><div style="font-weight:600;font-size:0.85rem;">$5 Off</div><div style="font-size:0.72rem;color:var(--text-muted);">500 points</div></div>
                                    <button class="btn btn-small ${points >= 500 ? '' : 'btn-outline'}" ${points < 500 ? 'disabled' : ''}>Redeem</button>
                                </div>
                                <div style="padding:0.8rem;background:var(--surface-2);border-radius:10px;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                                    <div><div style="font-weight:600;font-size:0.85rem;">$15 Off</div><div style="font-size:0.72rem;color:var(--text-muted);">1500 points</div></div>
                                    <button class="btn btn-small ${points >= 1500 ? '' : 'btn-outline'}" ${points < 1500 ? 'disabled' : ''}>Redeem</button>
                                </div>
                                <div style="padding:0.8rem;background:var(--surface-2);border-radius:10px;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                                    <div><div style="font-weight:600;font-size:0.85rem;">Free Shipping</div><div style="font-size:0.72rem;color:var(--text-muted);">300 points</div></div>
                                    <button class="btn btn-small ${points >= 300 ? '' : 'btn-outline'}" ${points < 300 ? 'disabled' : ''}>Redeem</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (page === 'profile') {
                content.innerHTML = `
                    <div class="dash-page-header"><div><h2><i class="fas fa-user-edit"></i> Profile Settings</h2><p>Update your personal information</p></div></div>
                    <div class="content-card">
                        <form id="profileForm">
                            <div class="form-group"><label>Full Name</label><input type="text" id="pName" value="${currentUser.name}" required></div>
                            <div class="form-group"><label>Email</label><input type="email" id="pEmail" value="${currentUser.email}" required></div>
                            <button type="submit" class="btn btn-small btn-success"><i class="fas fa-save"></i> Save Changes</button>
                        </form>
                    </div>
                `;
                document.getElementById('profileForm').addEventListener('submit', function(e) {
                    e.preventDefault();
                    currentUser.name = document.getElementById('pName').value.trim();
                    currentUser.email = document.getElementById('pEmail').value.trim();
                    saveAll(); updateUserUI(); loadDashboard();
                    showToast('Profile updated!', 'success');
                });
            }
        }

        function switchDashboardPage(page) {
            document.querySelectorAll('.dash-nav-item[data-page]').forEach(i => i.classList.toggle('active', i.dataset.page === page));
            renderDashboardPage(page);
            document.getElementById('dashboardSidebar').classList.remove('open');
            document.getElementById('sidebarOverlay').classList.remove('active');
        }

        function trackOrder(orderId) {
            const userData = JSON.parse(localStorage.getItem(`furni_userdata_${currentUser.email}`)) || {};
            const order = (userData.orders || []).find(o => o.id === orderId);
            if (!order) return;
            document.getElementById('checkoutBody').innerHTML = `
                <div class="checkout-panel active">
                    <h3 style="margin-bottom:0.9rem;"><i class="fas fa-truck"></i> Order Tracking</h3>
                    <div style="background:var(--surface-2);padding:0.9rem;border-radius:10px;margin-bottom:1rem;">
                        <strong>#${order.id}</strong>
                        <div style="font-size:0.78rem;color:var(--text-muted);">Tracking: ${order.trackingNumber || 'N/A'}</div>
                    </div>
                    <div class="order-timeline">
                        ${['Order Placed','Processing','Shipped','Out for Delivery','Delivered'].map((label, i) => `
                            <div class="timeline-step ${i <= 2 ? 'completed' : ''} ${i === 2 ? 'active' : ''}">
                                <div class="timeline-icon"><i class="fas fa-check"></i></div>
                                <div class="timeline-info"><div class="title">${label}</div></div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn" style="width:100%;" onclick="closeCheckout()">Close</button>
                </div>
            `;
            document.getElementById('checkoutModal').classList.add('active');
        }

        // ============ CHECKOUT ============
        function openCheckout() {
            if (!currentUser) { showToast('Please sign in', 'warning'); openAuthModal('signin'); return; }
            if (cart.length === 0) { showToast('Cart is empty', 'warning'); return; }
            checkoutStep = 1;
            appliedCoupon = null;
            checkoutData = { shipping: {}, payment: {} };
            renderCheckout();
            document.getElementById('checkoutModal').classList.add('active');
            document.body.style.overflow = 'hidden';
            document.getElementById('cartSidebar').classList.remove('active');
            document.getElementById('cartOverlay').classList.remove('active');
        }

        function closeCheckout() { document.getElementById('checkoutModal').classList.remove('active'); document.body.style.overflow = ''; }

        function calcTotals() {
            const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
            let ship = sub > 500 ? 0 : 25;
            let disc = 0;
            if (appliedCoupon && COUPONS[appliedCoupon]) {
                const c = COUPONS[appliedCoupon];
                if (c.type === 'percent') disc = sub * (c.value / 100);
                else if (c.type === 'fixed') disc = c.value;
                else if (c.type === 'shipping') ship = 0;
            }
            const tax = (sub - disc) * 0.08;
            return { sub, ship, disc, tax, total: sub - disc + ship + tax };
        }

        function renderCheckout() {
            document.querySelectorAll('.checkout-step').forEach(s => {
                const n = parseInt(s.dataset.step);
                s.classList.remove('active', 'completed');
                if (n === checkoutStep) s.classList.add('active');
                if (n < checkoutStep) s.classList.add('completed');
            });
            const t = calcTotals();
            const body = document.getElementById('checkoutBody');

            if (checkoutStep === 1) {
                body.innerHTML = `
                    <div class="checkout-panel active">
                        <h3 style="margin-bottom:0.7rem;font-size:0.95rem;">Review Cart</h3>
                        <div class="checkout-summary">
                            ${cart.map(i => `<div class="checkout-summary-item"><span>${i.name} × ${i.qty}</span><span>$${(i.price * i.qty).toFixed(2)}</span></div>`).join('')}
                            <div class="checkout-summary-item total"><span>Subtotal</span><span>$${t.sub.toFixed(2)}</span></div>
                        </div>
                        <div class="coupon-section">
                            <label style="font-weight:600;font-size:0.8rem;margin-bottom:0.4rem;display:block;">Coupon Code</label>
                            <div class="coupon-input-row">
                                <input type="text" id="couponInput" placeholder="Enter code">
                                <button class="btn btn-small" id="applyCoupon">Apply</button>
                            </div>
                            <div class="coupon-tags">${Object.keys(COUPONS).map(c => `<span class="coupon-tag" data-code="${c}">${c}</span>`).join('')}</div>
                        </div>
                        <div class="checkout-actions">
                            <button class="btn btn-outline" onclick="closeCheckout()">Continue</button>
                            <button class="btn" onclick="goToStep(2)">Next <i class="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                `;
                document.getElementById('applyCoupon').addEventListener('click', applyCoupon);
                document.querySelectorAll('.coupon-tag').forEach(tag => tag.addEventListener('click', () => {
                    document.getElementById('couponInput').value = tag.dataset.code;
                    applyCoupon();
                }));
            } else if (checkoutStep === 2) {
                const s = checkoutData.shipping || {};
                body.innerHTML = `
                    <div class="checkout-panel active">
                        <h3 style="margin-bottom:0.7rem;font-size:0.95rem;">Shipping Information</h3>
                        <div class="form-group"><label>Full Name</label><input type="text" id="sName" value="${s.name || ''}" required></div>
                        <div class="form-group"><label>Email</label><input type="email" id="sEmail" value="${s.email || ''}" required></div>
                        <div class="form-group"><label>Street</label><input type="text" id="sStreet" value="${s.street || ''}" required></div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.7rem;">
                            <div class="form-group"><label>City</label><input type="text" id="sCity" value="${s.city || ''}" required></div>
                            <div class="form-group"><label>State</label><input type="text" id="sState" value="${s.state || ''}" required></div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.7rem;">
                            <div class="form-group"><label>ZIP</label><input type="text" id="sZip" value="${s.zip || ''}" required></div>
                            <div class="form-group"><label>Country</label><input type="text" id="sCountry" value="${s.country || 'USA'}" required></div>
                        </div>
                        <div class="checkout-actions">
                            <button class="btn btn-outline" onclick="goToStep(1)"><i class="fas fa-arrow-left"></i> Back</button>
                            <button class="btn" onclick="saveShipping()">Next <i class="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                `;
            } else if (checkoutStep === 3) {
                body.innerHTML = `
                    <div class="checkout-panel active">
                        <h3 style="margin-bottom:0.7rem;font-size:0.95rem;">Payment Method</h3>
                        <div class="payment-methods">
                            <div class="payment-method active" data-method="card"><i class="fas fa-credit-card"></i><div><div style="font-weight:600;font-size:0.85rem;">Credit / Debit Card</div><div style="font-size:0.72rem;color:var(--text-muted);">Visa, Mastercard</div></div></div>
                            <div class="payment-method" data-method="paypal"><i class="fab fa-paypal"></i><div><div style="font-weight:600;font-size:0.85rem;">PayPal</div><div style="font-size:0.72rem;color:var(--text-muted);">Pay with PayPal</div></div></div>
                            <div class="payment-method" data-method="cod"><i class="fas fa-money-bill-wave"></i><div><div style="font-weight:600;font-size:0.85rem;">Cash on Delivery</div><div style="font-size:0.72rem;color:var(--text-muted);">Pay when delivered</div></div></div>
                        </div>
                        <div id="cardFields">
                            <div class="form-group"><label>Card Number</label><input type="text" id="cardNum" placeholder="1234 5678 9012 3456"></div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.7rem;">
                                <div class="form-group"><label>Expiry</label><input type="text" id="cardExp" placeholder="MM/YY"></div>
                                <div class="form-group"><label>CVV</label><input type="text" id="cardCvv" placeholder="123"></div>
                            </div>
                        </div>
                        <div class="checkout-actions">
                            <button class="btn btn-outline" onclick="goToStep(2)"><i class="fas fa-arrow-left"></i> Back</button>
                            <button class="btn" onclick="savePayment()">Review <i class="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                `;
                checkoutData.payment = { method: 'card' };
                body.querySelectorAll('.payment-method').forEach(m => m.addEventListener('click', function() {
                    body.querySelectorAll('.payment-method').forEach(x => x.classList.remove('active'));
                    this.classList.add('active');
                    checkoutData.payment.method = this.dataset.method;
                    document.getElementById('cardFields').style.display = this.dataset.method === 'card' ? 'block' : 'none';
                }));
            } else if (checkoutStep === 4) {
                const s = checkoutData.shipping, p = checkoutData.payment;
                body.innerHTML = `
                    <div class="checkout-panel active">
                        <h3 style="margin-bottom:0.7rem;font-size:0.95rem;">Confirm Order</h3>
                        <div class="checkout-summary">
                            <div style="margin-bottom:0.7rem;font-size:0.82rem;"><strong>Ship to:</strong><br>${s.name}<br>${s.street}<br>${s.city}, ${s.state} ${s.zip}</div>
                            <div style="margin-bottom:0.7rem;font-size:0.82rem;"><strong>Payment:</strong> ${p.method === 'card' ? 'Card' : p.method === 'paypal' ? 'PayPal' : 'COD'}</div>
                            <div class="checkout-summary-item"><span>Subtotal</span><span>$${t.sub.toFixed(2)}</span></div>
                            ${t.disc > 0 ? `<div class="checkout-summary-item discount"><span>Discount</span><span>−$${t.disc.toFixed(2)}</span></div>` : ''}
                            <div class="checkout-summary-item"><span>Shipping</span><span>${t.ship === 0 ? 'FREE' : '$' + t.ship.toFixed(2)}</span></div>
                            <div class="checkout-summary-item"><span>Tax</span><span>$${t.tax.toFixed(2)}</span></div>
                            <div class="checkout-summary-item total"><span>Total</span><span>$${t.total.toFixed(2)}</span></div>
                        </div>
                        <div class="checkout-actions">
                            <button class="btn btn-outline" onclick="goToStep(3)"><i class="fas fa-arrow-left"></i> Back</button>
                            <button class="btn btn-success" onclick="placeOrder()"><i class="fas fa-lock"></i> Place Order</button>
                        </div>
                    </div>
                `;
            }
        }

        function applyCoupon() {
            const code = document.getElementById('couponInput').value.trim().toUpperCase();
            if (!COUPONS[code]) { showToast('Invalid code', 'error'); return; }
            const c = COUPONS[code];
            const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
            if (sub < c.minOrder) { showToast(`Min $${c.minOrder} required`, 'warning'); return; }
            appliedCoupon = code;
            showToast(`Coupon applied: ${c.desc}`, 'success');
            renderCheckout();
        }

        function goToStep(n) { checkoutStep = n; renderCheckout(); }

        function saveShipping() {
            const s = {
                name: document.getElementById('sName').value.trim(),
                email: document.getElementById('sEmail').value.trim(),
                street: document.getElementById('sStreet').value.trim(),
                city: document.getElementById('sCity').value.trim(),
                state: document.getElementById('sState').value.trim(),
                zip: document.getElementById('sZip').value.trim(),
                country: document.getElementById('sCountry').value.trim()
            };
            if (!s.name || !s.email || !s.street || !s.city || !s.state || !s.zip) { showToast('Fill required fields', 'error'); return; }
            checkoutData.shipping = s;
            goToStep(3);
        }

        function savePayment() {
            const method = checkoutData.payment.method || 'card';
            if (method === 'card') {
                const num = document.getElementById('cardNum').value.trim();
                const exp = document.getElementById('cardExp').value.trim();
                const cvv = document.getElementById('cardCvv').value.trim();
                if (!num || !exp || !cvv) { showToast('Fill card details', 'error'); return; }
                checkoutData.payment = { method, num, exp, cvv };
            }
            goToStep(4);
        }

        function placeOrder() {
            const t = calcTotals();
            const orderId = 'ORD-' + Date.now().toString().slice(-6);
            const order = {
                id: orderId,
                date: new Date().toISOString(),
                items: cart.reduce((s, i) => s + i.qty, 0),
                total: t.total,
                status: 'processing',
                shipping: checkoutData.shipping,
                payment: checkoutData.payment.method,
                trackingNumber: 'TRK' + Date.now().toString().slice(-8)
            };
            const key = `furni_userdata_${currentUser.email}`;
            const userData = JSON.parse(localStorage.getItem(key)) || { addresses: [], orders: [], phone: '', profile: {} };
            userData.orders = userData.orders || [];
            userData.orders.unshift(order);
            localStorage.setItem(key, JSON.stringify(userData));
            const earned = Math.floor(t.total * 10);
            addPoints(earned);
            createConfetti();
            document.getElementById('checkoutBody').innerHTML = `
                <div class="checkout-panel active">
                    <div class="order-success">
                        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                        <h3 style="margin-bottom:0.4rem;">Order Placed!</h3>
                        <p style="color:var(--text-secondary);margin-bottom:1rem;font-size:0.82rem;">Confirmation sent to your email.</p>
                        <div class="order-number">#${orderId}</div>
                        <p style="color:var(--success);font-weight:600;margin-bottom:1.2rem;font-size:0.82rem;"><i class="fas fa-coins"></i> You earned ${earned} points!</p>
                        <button class="btn" style="width:100%;" onclick="closeCheckout()">Continue Shopping</button>
                    </div>
                </div>
            `;
            cart = [];
            saveAll();
            updateCartUI();
        }

        // ============ ADMIN ============
        function openAdmin() {
            if (!currentUser || currentUser.email !== 'admin@furnicraft.com') { showToast('Admin access only', 'error'); return; }
            document.getElementById('adminModal').classList.add('active');
            document.body.style.overflow = 'hidden';
            renderAdminPanel('dashboard');
        }

        function renderAdminPanel(panel) {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.panel === panel));
            const body = document.getElementById('adminBody');
            const allProducts = getAllProducts();
            const users = JSON.parse(localStorage.getItem('furni_users')) || [];
            const allOrders = [];
            users.forEach(u => {
                const d = JSON.parse(localStorage.getItem(`furni_userdata_${u.email}`)) || {};
                (d.orders || []).forEach(o => allOrders.push({ ...o, userEmail: u.email, userName: u.name }));
            });

            if (panel === 'dashboard') {
                const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);
                body.innerHTML = `
                    <div class="admin-panel active">
                        <div class="admin-stats">
                            <div class="admin-stat"><div class="num">${allProducts.length}</div><div class="lbl">Products</div></div>
                            <div class="admin-stat"><div class="num">${allOrders.length}</div><div class="lbl">Orders</div></div>
                            <div class="admin-stat"><div class="num">${users.length}</div><div class="lbl">Users</div></div>
                            <div class="admin-stat"><div class="num">$${totalRevenue.toFixed(0)}</div><div class="lbl">Revenue</div></div>
                        </div>
                        <h3 style="margin-bottom:0.7rem;font-size:0.9rem;">Recent Orders</h3>
                        <div style="overflow-x:auto;">
                            <table class="admin-table">
                                <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
                                <tbody>${allOrders.slice(0, 5).map(o => `<tr><td>#${o.id}</td><td>${o.userName}</td><td>${new Date(o.date).toLocaleDateString()}</td><td>$${o.total.toFixed(2)}</td><td><span class="badge">${o.status}</span></td></tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No orders</td></tr>'}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            } else if (panel === 'products') {
                body.innerHTML = `
                    <div class="admin-panel active">
                        <h3 style="margin-bottom:0.7rem;font-size:0.9rem;">All Products (${allProducts.length})</h3>
                        <div style="max-height:400px;overflow:auto;">
                            <table class="admin-table">
                                <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th></tr></thead>
                                <tbody>${allProducts.slice(0, 30).map(p => `<tr><td><img src="${p.image}" style="width:34px;height:34px;object-fit:cover;border-radius:6px;"></td><td>${p.name}</td><td>$${p.price.toFixed(2)}</td><td>${p.stock}</td><td>${p.category}</td></tr>`).join('')}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            } else if (panel === 'orders') {
                body.innerHTML = `
                    <div class="admin-panel active">
                        <h3 style="margin-bottom:0.7rem;font-size:0.9rem;">All Orders (${allOrders.length})</h3>
                        <div style="overflow-x:auto;">
                            <table class="admin-table">
                                <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                                <tbody>${allOrders.map(o => `<tr><td>#${o.id}</td><td>${o.userName}</td><td>${o.items}</td><td>$${o.total.toFixed(2)}</td><td><span class="badge">${o.status}</span></td></tr>`).join('') || '<tr><td colspan="5" style="text-align:center;">No orders</td></tr>'}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            } else if (panel === 'users') {
                body.innerHTML = `
                    <div class="admin-panel active">
                        <h3 style="margin-bottom:0.7rem;font-size:0.9rem;">All Users (${users.length})</h3>
                        <div style="overflow-x:auto;">
                            <table class="admin-table">
                                <thead><tr><th>Name</th><th>Email</th><th>Orders</th><th>Points</th></tr></thead>
                                <tbody>${users.map(u => {
                                    const pts = parseInt(localStorage.getItem(`furni_loyalty_${u.email}`)) || 0;
                                    const d = JSON.parse(localStorage.getItem(`furni_userdata_${u.email}`)) || {};
                                    return `<tr><td>${u.name}</td><td>${u.email}</td><td>${(d.orders || []).length}</td><td>${pts}</td></tr>`;
                                }).join('')}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            }
        }

        // ============ LIVE CHAT ============
        const BOT_REPLIES = {
            'track': 'You can track your order from your dashboard → Orders.',
            'shipping': 'We offer FREE shipping on orders over $500! Delivery in 3-5 days.',
            'return': 'We have a 30-day return policy. Products must be in original condition.',
            'default': 'Thanks for your message! Our team will get back to you shortly.'
        };

        function addChatMessage(text, sender = 'bot') {
            const body = document.getElementById('chatBody');
            const msg = document.createElement('div');
            msg.className = `chat-message ${sender}`;
            msg.innerHTML = `<div class="chat-bubble">${text}</div>`;
            body.appendChild(msg);
            body.scrollTop = body.scrollHeight;
        }

        function handleChatSend(msg) {
            if (!msg.trim()) return;
            addChatMessage(msg, 'user');
            const lower = msg.toLowerCase();
            let reply = BOT_REPLIES.default;
            if (lower.includes('track') || lower.includes('order')) reply = BOT_REPLIES.track;
            else if (lower.includes('ship')) reply = BOT_REPLIES.shipping;
            else if (lower.includes('return') || lower.includes('refund')) reply = BOT_REPLIES.return;
            setTimeout(() => addChatMessage(reply, 'bot'), 700);
        }

        // ============ PWA ============
        function initPWA() {
            if (!localStorage.getItem('pwa-dismissed') && !localStorage.getItem('pwa-shown')) {
                setTimeout(() => {
                    document.getElementById('pwaBanner').classList.add('show');
                    localStorage.setItem('pwa-shown', '1');
                }, 15000);
            }
            document.getElementById('pwaDismiss').addEventListener('click', () => {
                document.getElementById('pwaBanner').classList.remove('show');
                localStorage.setItem('pwa-dismissed', '1');
            });
            document.getElementById('pwaInstall').addEventListener('click', () => {
                showToast('App installed! (demo)', 'success');
                document.getElementById('pwaBanner').classList.remove('show');
                localStorage.setItem('pwa-dismissed', '1');
            });
        }

        // ============ FLASH SALE ============
        function startFlashTimer() {
            const end = new Date();
            end.setHours(end.getHours() + 8, end.getMinutes() + 45, end.getSeconds() + 30);
            setInterval(() => {
                const d = end - new Date();
                if (d < 0) return;
                const h = String(Math.floor(d / 3600000)).padStart(2, '0');
                const m = String(Math.floor(d % 3600000 / 60000)).padStart(2, '0');
                const s = String(Math.floor(d % 60000 / 1000)).padStart(2, '0');
                const hEl = document.getElementById('flashHours');
                const mEl = document.getElementById('flashMinutes');
                const sEl = document.getElementById('flashSeconds');
                if (hEl.textContent !== h) { hEl.textContent = h; hEl.style.transform = 'scale(1.2)'; setTimeout(() => hEl.style.transform = 'scale(1)', 200); }
                if (mEl.textContent !== m) { mEl.textContent = m; mEl.style.transform = 'scale(1.2)'; setTimeout(() => mEl.style.transform = 'scale(1)', 200); }
                if (sEl.textContent !== s) { sEl.textContent = s; sEl.style.transform = 'scale(1.2)'; setTimeout(() => sEl.style.transform = 'scale(1)', 200); }
            }, 1000);
        }

        // ============ REVIEWS ============
        function renderReviews() {
            const list = document.getElementById('reviewsList');
            if (!list) return;
            list.innerHTML = REVIEWS_DATA.map(r => `
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
                </div>
            `).join('');
            const barsEl = document.getElementById('ratingBars');
            if (barsEl) {
                const dist = [78, 15, 5, 1, 1];
                const counts = [99, 19, 6, 2, 1];
                barsEl.innerHTML = dist.map((p, i) => `
                    <div class="rating-bar">
                        <span class="bar-label">${5 - i} ★</span>
                        <div class="bar-track"><div class="bar-fill" data-width="${p}%" style="width:0"></div></div>
                        <span class="bar-count">${counts[i]}</span>
                    </div>
                `).join('');
                setTimeout(() => {
                    barsEl.querySelectorAll('.bar-fill').forEach(b => { b.style.width = b.dataset.width; });
                }, 500);
            }
        }

        // ============ SEARCH ============
        function handleSearch(q) {
            const box = document.getElementById('searchSuggestions');
            if (!q.trim()) { box.classList.remove('active'); return; }
            const query = q.toLowerCase();
            const matches = getAllProducts().filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)).slice(0, 6);
            if (matches.length === 0) {
                box.innerHTML = `<div style="padding:1.2rem;text-align:center;color:var(--text-muted);font-size:0.82rem;">No results for "${q}"</div>`;
            } else {
                box.innerHTML = matches.map(p => `
                    <div class="suggestion-item" data-id="${p.id}">
                        <img src="${p.image}" alt="${p.name}">
                        <div class="suggestion-item-info"><div class="name">${p.name}</div><div class="price">$${p.price.toFixed(2)}</div></div>
                    </div>
                `).join('');
                box.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', function() {
                        openQuickView(parseInt(this.dataset.id));
                        box.classList.remove('active');
                        document.getElementById('searchInput').value = '';
                        document.getElementById('searchWrapper').classList.remove('mobile-open');
                    });
                });
            }
            box.classList.add('active');
        }

        // ============ INIT ============
        function init() {
            setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
            document.querySelectorAll('.cart-badge, .wishlist-badge, .compare-badge').forEach(b => b.classList.add('hidden'));

            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.querySelector('#themeToggle i').className = 'fas fa-sun';
            }

            renderProductGrid(FEATURED, document.getElementById('productGrid'));
            renderRecentlyViewed();
            renderRecommendations('trending');
            renderReviews();
            updateCartUI();
            updateWishlistUI();
            updateCompareUI();
            updateUserUI();
            startFlashTimer();
            initPWA();
            initScrollReveal();
            initHeroParticles();

            if (localStorage.getItem('chat-seen')) {
                const notif = document.getElementById('chatNotification');
                if (notif) notif.remove();
            }

            const users = JSON.parse(localStorage.getItem('furni_users')) || [];
            if (!users.find(u => u.email === 'admin@furnicraft.com')) {
                users.push({ name: 'Admin User', email: 'admin@furnicraft.com', password: 'admin123' });
                localStorage.setItem('furni_users', JSON.stringify(users));
            }

            document.querySelectorAll('.btn').forEach(addRippleEffect);

            document.getElementById('searchToggle').addEventListener('click', function() {
                const wrapper = document.getElementById('searchWrapper');
                wrapper.classList.toggle('mobile-open');
                if (wrapper.classList.contains('mobile-open')) setTimeout(() => document.getElementById('searchInput').focus(), 100);
            });
            document.getElementById('searchInput').addEventListener('input', function() { handleSearch(this.value); });
            document.getElementById('searchInput').addEventListener('focus', function() { if (this.value.trim()) handleSearch(this.value); });
            document.addEventListener('click', e => { 
                if (!e.target.closest('.search-wrapper') && !e.target.closest('#searchToggle')) {
                    document.getElementById('searchSuggestions').classList.remove('active');
                }
            });

            document.querySelectorAll('.nav-links a, .mobile-menu a[href^="#"]').forEach(a => {
                a.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href === '#dashboard') { e.preventDefault(); showDashboard(); document.getElementById('mobileMenu').classList.remove('active'); return; }
                    if (href === '#admin') { e.preventDefault(); openAdmin(); document.getElementById('mobileMenu').classList.remove('active'); return; }
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        if (document.getElementById('categoryPage').classList.contains('active')) hideCategoryPage();
                        if (document.getElementById('dashboardWrapper').classList.contains('active')) hideDashboard();
                        const el = document.querySelector(href);
                        if (el) {
                            const h = document.querySelector('header').offsetHeight;
                            window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - h, behavior: 'smooth' });
                        }
                    }
                });
            });

            document.getElementById('homeLink').addEventListener('click', () => {
                if (document.getElementById('categoryPage').classList.contains('active')) hideCategoryPage();
                if (document.getElementById('dashboardWrapper').classList.contains('active')) hideDashboard();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            document.querySelectorAll('.category-card').forEach(c => c.addEventListener('click', function() { showCategoryPage(this.dataset.category); }));
            document.getElementById('backFromCategory').addEventListener('click', hideCategoryPage);

            document.querySelectorAll('.rec-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.rec-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    renderRecommendations(this.dataset.tab);
                });
            });

            document.getElementById('cartOpen').addEventListener('click', () => { document.getElementById('cartSidebar').classList.add('active'); document.getElementById('cartOverlay').classList.add('active'); });
            document.getElementById('cartClose').addEventListener('click', () => { document.getElementById('cartSidebar').classList.remove('active'); document.getElementById('cartOverlay').classList.remove('active'); });
            document.getElementById('cartOverlay').addEventListener('click', () => { document.getElementById('cartSidebar').classList.remove('active'); document.getElementById('cartOverlay').classList.remove('active'); });
            document.getElementById('checkoutBtn').addEventListener('click', openCheckout);

            document.getElementById('compareOpen').addEventListener('click', openCompareModal);
            document.getElementById('openCompareModal').addEventListener('click', openCompareModal);
            document.getElementById('clearCompare').addEventListener('click', () => { compareList = []; saveAll(); updateCompareUI(); showToast('Cleared', 'info'); });
            document.getElementById('compareClose').addEventListener('click', () => { document.getElementById('compareModal').classList.remove('active'); document.body.style.overflow = ''; });
            document.getElementById('compareModal').addEventListener('click', function(e) { if (e.target === this) { this.classList.remove('active'); document.body.style.overflow = ''; } });

            document.getElementById('wishlistOpen').addEventListener('click', () => {
                showToast(wishlist.length === 0 ? 'Wishlist is empty' : `${wishlist.length} items in wishlist`, 'info');
            });

            document.getElementById('themeToggle').addEventListener('click', function() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                if (isDark) { document.documentElement.removeAttribute('data-theme'); this.querySelector('i').className = 'fas fa-moon'; theme = 'light'; }
                else { document.documentElement.setAttribute('data-theme', 'dark'); this.querySelector('i').className = 'fas fa-sun'; theme = 'dark'; }
                saveAll();
            });

            document.getElementById('userAvatar').addEventListener('click', function(e) {
                e.stopPropagation();
                if (currentUser) showDashboard();
                else openAuthModal('signin');
            });

            document.getElementById('authClose').addEventListener('click', closeAuthModal);
            document.getElementById('authModal').addEventListener('click', function(e) { if (e.target === this) closeAuthModal(); });
            document.querySelectorAll('.auth-tabs button').forEach(b => b.addEventListener('click', function() { openAuthModal(this.dataset.tab); }));
            document.getElementById('switchToSignup').addEventListener('click', () => openAuthModal('signup'));
            document.getElementById('switchToSignin').addEventListener('click', () => openAuthModal('signin'));

            document.getElementById('signinForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('signinEmail').value.trim();
                const pass = document.getElementById('signinPassword').value.trim();
                const users = JSON.parse(localStorage.getItem('furni_users')) || [];
                const found = users.find(u => u.email === email && u.password === pass);
                if (found) {
                    currentUser = { name: found.name, email: found.email };
                    saveAll(); updateUserUI(); closeAuthModal();
                    showToast(`Welcome back, ${found.name.split(' ')[0]}!`, 'success');
                    this.reset();
                } else showToast('Invalid credentials', 'error');
            });

            document.getElementById('signupForm').addEventListener('submit', function(e) {
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
                saveAll(); updateUserUI(); closeAuthModal();
                showToast(`Welcome, ${name.split(' ')[0]}!`, 'success');
                this.reset();
                const key = `furni_userdata_${email}`;
                if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ addresses: [], orders: [], phone: '', profile: { name, email } }));
            });

            document.getElementById('mobileSignIn').addEventListener('click', () => { openAuthModal('signin'); document.getElementById('mobileMenu').classList.remove('active'); });
            document.getElementById('mobileSignUp').addEventListener('click', () => { openAuthModal('signup'); document.getElementById('mobileMenu').classList.remove('active'); });

            document.getElementById('quickViewClose').addEventListener('click', closeQuickView);
            document.getElementById('quickViewModal').addEventListener('click', function(e) { if (e.target === this) closeQuickView(); });

            document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
            document.getElementById('checkoutModal').addEventListener('click', function(e) { if (e.target === this) closeCheckout(); });

            document.getElementById('adminNav')?.addEventListener('click', function(e) { e.preventDefault(); openAdmin(); });
            document.getElementById('mobileAdminNav')?.addEventListener('click', function(e) { e.preventDefault(); openAdmin(); document.getElementById('mobileMenu').classList.remove('active'); });
            document.getElementById('adminClose').addEventListener('click', () => { document.getElementById('adminModal').classList.remove('active'); document.body.style.overflow = ''; });
            document.getElementById('adminModal').addEventListener('click', function(e) { if (e.target === this) { this.classList.remove('active'); document.body.style.overflow = ''; } });
            document.querySelectorAll('.admin-tab').forEach(t => t.addEventListener('click', function() { renderAdminPanel(this.dataset.panel); }));

            document.getElementById('logoutSidebarBtn').addEventListener('click', () => {
                currentUser = null;
                localStorage.removeItem('furni_user');
                updateUserUI(); hideDashboard();
                showToast('Signed out', 'info');
            });
            document.querySelectorAll('.dash-nav-item[data-page]').forEach(i => i.addEventListener('click', function() { switchDashboardPage(this.dataset.page); }));
            document.getElementById('mobileSidebarToggle')?.addEventListener('click', () => {
                document.getElementById('dashboardSidebar').classList.toggle('open');
                document.getElementById('sidebarOverlay').classList.toggle('active');
            });
            document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
                document.getElementById('dashboardSidebar').classList.remove('open');
                document.getElementById('sidebarOverlay').classList.remove('active');
            });

            document.getElementById('chatToggle').addEventListener('click', () => {
                document.getElementById('chatPanel').classList.toggle('active');
                document.getElementById('chatNotification')?.remove();
                localStorage.setItem('chat-seen', '1');
            });
            document.getElementById('chatClose').addEventListener('click', () => document.getElementById('chatPanel').classList.remove('active'));
            document.getElementById('chatSend').addEventListener('click', () => {
                const input = document.getElementById('chatInput');
                handleChatSend(input.value);
                input.value = '';
            });
            document.getElementById('chatInput').addEventListener('keypress', function(e) { if (e.key === 'Enter') { handleChatSend(this.value); this.value = ''; } });
            document.querySelectorAll('.chat-quick-reply').forEach(b => b.addEventListener('click', function() { handleChatSend(this.dataset.msg); }));

            document.getElementById('hamburgerBtn').addEventListener('click', function() {
                document.getElementById('mobileMenu').classList.toggle('active');
                this.querySelector('i').className = document.getElementById('mobileMenu').classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            });
            document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
                document.getElementById('mobileMenu').classList.remove('active');
                document.getElementById('hamburgerBtn').querySelector('i').className = 'fas fa-bars';
            }));

            document.getElementById('contactForm').addEventListener('submit', function(e) { e.preventDefault(); showToast('Message sent!', 'success'); this.reset(); });
            document.getElementById('newsletterForm').addEventListener('submit', function(e) { e.preventDefault(); showToast('Subscribed!', 'success'); this.reset(); });

            // ============ DASHBOARD FOOTER ============
            document.getElementById('dashNewsletterForm')?.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input').value.trim();
                if (!email) return;
                showToast('Subscribed successfully!', 'success');
                this.reset();
                createConfetti();
            });
            document.getElementById('dashBackToTop')?.addEventListener('click', () => {
                const dashMain = document.querySelector('.dashboard-main');
                if (dashMain) dashMain.scrollTo({ top: 0, behavior: 'smooth' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (document.getElementById('cartSidebar').classList.contains('active')) { document.getElementById('cartSidebar').classList.remove('active'); document.getElementById('cartOverlay').classList.remove('active'); }
                    if (document.getElementById('authModal').classList.contains('active')) closeAuthModal();
                    if (document.getElementById('quickViewModal').classList.contains('active')) closeQuickView();
                    if (document.getElementById('checkoutModal').classList.contains('active')) closeCheckout();
                    if (document.getElementById('compareModal').classList.contains('active')) { document.getElementById('compareModal').classList.remove('active'); document.body.style.overflow = ''; }
                    if (document.getElementById('adminModal').classList.contains('active')) { document.getElementById('adminModal').classList.remove('active'); document.body.style.overflow = ''; }
                }
            });

            window.addEventListener('scroll', function() {
                const st = window.pageYOffset;
                const dh = document.documentElement.scrollHeight - window.innerHeight;
                document.getElementById('scrollProgress').style.width = (dh > 0 ? (st / dh) * 100 : 0) + '%';
                document.getElementById('backToTop').classList.toggle('visible', st > 300);
                document.getElementById('mainHeader').classList.toggle('scrolled', st > 20);
            });
            document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

            let prog = 65;
            setInterval(() => {
                if (prog < 95) {
                    prog = Math.min(95, prog + Math.random() * 2);
                    document.getElementById('flashProgressBar').style.width = prog + '%';
                }
            }, 8000);
        }

        window.goToStep = goToStep;
        window.saveShipping = saveShipping;
        window.savePayment = savePayment;
        window.placeOrder = placeOrder;
        window.closeCheckout = closeCheckout;
        window.switchDashboardPage = switchDashboardPage;
        window.hideDashboard = hideDashboard;

        document.addEventListener('DOMContentLoaded', init);
    })();
    