 <script>
        (function () {
            // ============================================================
            // 1. PRODUCT DATA
            // ============================================================
            const FEATURED = [
                { id: 1, name: 'Luxury Velvet Sofa', price: 899.99, oldPrice: 1299.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Elegant velvet with premium cushioning.', rating: 4.8, reviewCount: 124, isNew: true, colors: ['#4a5568', '#2d3748', '#e2e8f0', '#c53030'], sizes: ['2-Seat', '3-Seat', 'L-Shape'] },
                { id: 2, name: 'Modern Armchair', price: 349.99, oldPrice: 449.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ergonomic design with stylish fabric.', rating: 4.6, reviewCount: 89, isNew: false, colors: ['#2d3748', '#4a5568', '#d69e2e', '#38a169'], sizes: ['Standard', 'Wide'] },
                { id: 3, name: 'Oak Dining Table', price: 599.99, oldPrice: 799.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Solid oak, extendable for gatherings.', rating: 4.9, reviewCount: 67, isNew: true, colors: ['#d69e2e', '#4a5568', '#2d3748'], sizes: ['6-Seat', '8-Seat', '10-Seat'] },
                { id: 4, name: 'Minimalist Bed Frame', price: 749.99, oldPrice: 999.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Clean lines, sturdy construction.', rating: 4.7, reviewCount: 156, isNew: false, colors: ['#2d3748', '#4a5568', '#e2e8f0'], sizes: ['Queen', 'King', 'California King'] }
            ];

            const CATEGORY_PRODUCTS = {
                living: [
                    { id: 101, name: 'Sectional Sofa', price: 1299.99, oldPrice: 1699.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Spacious L-shaped sectional.', rating: 4.8, reviewCount: 45, colors: ['#4a5568', '#2d3748'], sizes: ['L-Shape', 'U-Shape'] },
                    { id: 102, name: 'Coffee Table', price: 299.99, oldPrice: 399.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Minimalist wood and glass.', rating: 4.5, reviewCount: 32, colors: ['#d69e2e', '#4a5568'], sizes: ['Small', 'Large'] },
                    { id: 103, name: 'TV Stand', price: 449.99, oldPrice: 599.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern media console.', rating: 4.6, reviewCount: 28, colors: ['#2d3748', '#4a5568'], sizes: ['55"', '65"', '75"'] },
                    { id: 104, name: 'Accent Chair', price: 249.99, oldPrice: 329.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Mid-century modern style.', rating: 4.7, reviewCount: 51, colors: ['#c53030', '#d69e2e', '#38a169'], sizes: ['Standard'] },
                    { id: 105, name: 'Rug', price: 189.99, oldPrice: 259.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Wool blend, geometric pattern.', rating: 4.4, reviewCount: 19, colors: ['#4a5568', '#d69e2e'], sizes: ['5x8', '8x10', '9x12'] },
                    { id: 106, name: 'Floor Lamp', price: 159.99, oldPrice: 219.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable arc lamp.', rating: 4.6, reviewCount: 37, colors: ['#2d3748', '#d69e2e'], sizes: ['Standard'] },
                    { id: 107, name: 'Bookshelf', price: 399.99, oldPrice: 549.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '5-tier open shelving.', rating: 4.8, reviewCount: 42, colors: ['#4a5568', '#2d3748'], sizes: ['5-Tier', '7-Tier'] },
                    { id: 108, name: 'Ottoman', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Tufted storage ottoman.', rating: 4.5, reviewCount: 24, colors: ['#c53030', '#4a5568', '#d69e2e'], sizes: ['Small', 'Large'] },
                    { id: 109, name: 'Wall Art', price: 129.99, oldPrice: 179.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Abstract canvas set.', rating: 4.3, reviewCount: 15, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Set of 2', 'Set of 3'] },
                    { id: 110, name: 'Pouf', price: 89.99, oldPrice: 119.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Knitted cotton pouf.', rating: 4.7, reviewCount: 33, colors: ['#d69e2e', '#4a5568'], sizes: ['Standard'] }
                ],
                bedroom: [
                    { id: 201, name: 'King Bed Frame', price: 999.99, oldPrice: 1399.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Upholstered headboard.', rating: 4.9, reviewCount: 78, colors: ['#4a5568', '#2d3748'], sizes: ['Queen', 'King'] },
                    { id: 202, name: 'Nightstand', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Solid wood, two drawers.', rating: 4.6, reviewCount: 41, colors: ['#d69e2e', '#4a5568'], sizes: ['Standard', 'Wide'] },
                    { id: 203, name: 'Dresser', price: 549.99, oldPrice: 749.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '6-drawer modern dresser.', rating: 4.7, reviewCount: 36, colors: ['#2d3748', '#d69e2e'], sizes: ['6-Drawer', '8-Drawer'] },
                    { id: 204, name: 'Mirror', price: 129.99, oldPrice: 179.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Floor-length arched mirror.', rating: 4.8, reviewCount: 52, colors: ['#d69e2e', '#e2e8f0'], sizes: ['Full', 'Standard'] },
                    { id: 205, name: 'Bedside Lamp', price: 79.99, oldPrice: 109.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Dimmable ceramic lamp.', rating: 4.5, reviewCount: 27, colors: ['#e2e8f0', '#4a5568'], sizes: ['Standard'] },
                    { id: 206, name: 'Wardrobe', price: 799.99, oldPrice: 1099.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Sliding door wardrobe.', rating: 4.6, reviewCount: 31, colors: ['#2d3748', '#d69e2e'], sizes: ['2-Door', '3-Door'] },
                    { id: 207, name: 'Bench', price: 249.99, oldPrice: 349.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Upholstered bench with storage.', rating: 4.7, reviewCount: 22, colors: ['#c53030', '#4a5568'], sizes: ['Standard'] },
                    { id: 208, name: 'Rug', price: 159.99, oldPrice: 219.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Plush shag rug.', rating: 4.4, reviewCount: 18, colors: ['#e2e8f0', '#d69e2e'], sizes: ['4x6', '5x8'] },
                    { id: 209, name: 'Desk', price: 399.99, oldPrice: 549.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Compact writing desk.', rating: 4.5, reviewCount: 29, colors: ['#4a5568', '#d69e2e'], sizes: ['Standard', 'Large'] },
                    { id: 210, name: 'Pillow Set', price: 89.99, oldPrice: 119.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 4 decorative pillows.', rating: 4.8, reviewCount: 47, colors: ['#c53030', '#4a5568', '#d69e2e'], sizes: ['Set of 4'] }
                ],
                dining: [
                    { id: 301, name: 'Dining Table (6-seat)', price: 899.99, oldPrice: 1249.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Extendable oak table.', rating: 4.8, reviewCount: 54, colors: ['#d69e2e', '#4a5568'], sizes: ['6-Seat', '8-Seat'] },
                    { id: 302, name: 'Dining Chair', price: 149.99, oldPrice: 199.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Mid-century dining chair.', rating: 4.6, reviewCount: 62, colors: ['#4a5568', '#d69e2e'], sizes: ['Standard'] },
                    { id: 303, name: 'Sideboard', price: 599.99, oldPrice: 799.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Buffet with glass doors.', rating: 4.7, reviewCount: 35, colors: ['#2d3748', '#d69e2e'], sizes: ['Standard', 'Wide'] },
                    { id: 304, name: 'Bar Stool', price: 129.99, oldPrice: 179.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable height bar stool.', rating: 4.5, reviewCount: 43, colors: ['#c53030', '#2d3748'], sizes: ['Set of 2', 'Set of 4'] },
                    { id: 305, name: 'Table Runner', price: 39.99, oldPrice: 59.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Linen table runner.', rating: 4.4, reviewCount: 21, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Standard'] },
                    { id: 306, name: 'Dinnerware Set', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '16-piece stoneware set.', rating: 4.8, reviewCount: 38, colors: ['#e2e8f0', '#4a5568'], sizes: ['16-Piece', '24-Piece'] },
                    { id: 307, name: 'Wine Rack', price: 79.99, oldPrice: 109.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Wall-mounted wine rack.', rating: 4.6, reviewCount: 26, colors: ['#d69e2e', '#2d3748'], sizes: ['12-Bottle', '24-Bottle'] },
                    { id: 308, name: 'Chandelier', price: 349.99, oldPrice: 479.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern glass chandelier.', rating: 4.9, reviewCount: 29, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Standard'] },
                    { id: 309, name: 'Placemat Set', price: 29.99, oldPrice: 44.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 6 woven placemats.', rating: 4.3, reviewCount: 17, colors: ['#d69e2e', '#4a5568'], sizes: ['Set of 6'] },
                    { id: 310, name: 'Serving Cart', price: 249.99, oldPrice: 349.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Stainless steel serving cart.', rating: 4.7, reviewCount: 34, colors: ['#e2e8f0', '#2d3748'], sizes: ['Standard'] }
                ],
                office: [
                    { id: 401, name: 'Ergonomic Chair', price: 499.99, oldPrice: 699.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable lumbar support.', rating: 4.9, reviewCount: 88, colors: ['#2d3748', '#4a5568'], sizes: ['Standard'] },
                    { id: 402, name: 'Standing Desk', price: 699.99, oldPrice: 949.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Electric height-adjustable.', rating: 4.8, reviewCount: 56, colors: ['#d69e2e', '#4a5568'], sizes: ['48"', '60"', '72"'] },
                    { id: 403, name: 'Desk Lamp', price: 89.99, oldPrice: 129.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'LED task lamp.', rating: 4.6, reviewCount: 42, colors: ['#e2e8f0', '#2d3748'], sizes: ['Standard'] },
                    { id: 404, name: 'Bookshelf', price: 299.99, oldPrice: 419.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: '5-shelf industrial bookshelf.', rating: 4.7, reviewCount: 37, colors: ['#4a5568', '#d69e2e'], sizes: ['5-Shelf', '7-Shelf'] },
                    { id: 405, name: 'Office Drawer', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Rolling filing cabinet.', rating: 4.5, reviewCount: 23, colors: ['#2d3748', '#e2e8f0'], sizes: ['2-Drawer', '3-Drawer'] },
                    { id: 406, name: 'Monitor Stand', price: 59.99, oldPrice: 84.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable monitor riser.', rating: 4.4, reviewCount: 31, colors: ['#e2e8f0', '#2d3748'], sizes: ['Standard'] },
                    { id: 407, name: 'Desk Mat', price: 39.99, oldPrice: 54.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Leather desk mat.', rating: 4.7, reviewCount: 44, colors: ['#2d3748', '#d69e2e'], sizes: ['Standard', 'Large'] },
                    { id: 408, name: 'Pen Holder', price: 19.99, oldPrice: 29.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic pen organizer.', rating: 4.3, reviewCount: 19, colors: ['#e2e8f0', '#c53030'], sizes: ['Standard'] },
                    { id: 409, name: 'Wall Organizer', price: 49.99, oldPrice: 69.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Pegboard wall organizer.', rating: 4.5, reviewCount: 27, colors: ['#d69e2e', '#4a5568'], sizes: ['Standard'] },
                    { id: 410, name: 'Footrest', price: 69.99, oldPrice: 99.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ergonomic footrest.', rating: 4.6, reviewCount: 35, colors: ['#2d3748', '#e2e8f0'], sizes: ['Standard'] }
                ],
                lighting: [
                    { id: 501, name: 'Pendant Light', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Brass pendant with glass shade.', rating: 4.8, reviewCount: 46, colors: ['#d69e2e', '#2d3748'], sizes: ['Small', 'Large'] },
                    { id: 502, name: 'Floor Lamp', price: 149.99, oldPrice: 209.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Tripod floor lamp.', rating: 4.6, reviewCount: 38, colors: ['#e2e8f0', '#4a5568'], sizes: ['Standard'] },
                    { id: 503, name: 'Table Lamp', price: 89.99, oldPrice: 129.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic table lamp.', rating: 4.7, reviewCount: 52, colors: ['#c53030', '#e2e8f0'], sizes: ['Standard'] },
                    { id: 504, name: 'Wall Sconce', price: 79.99, oldPrice: 109.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 2 wall sconces.', rating: 4.5, reviewCount: 29, colors: ['#d69e2e', '#2d3748'], sizes: ['Set of 2'] },
                    { id: 505, name: 'Chandelier', price: 599.99, oldPrice: 849.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Crystal chandelier.', rating: 4.9, reviewCount: 24, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Standard'] },
                    { id: 506, name: 'Desk Lamp', price: 69.99, oldPrice: 99.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Architect desk lamp.', rating: 4.6, reviewCount: 41, colors: ['#2d3748', '#e2e8f0'], sizes: ['Standard'] },
                    { id: 507, name: 'String Lights', price: 39.99, oldPrice: 59.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Indoor string lights.', rating: 4.4, reviewCount: 33, colors: ['#d69e2e', '#e2e8f0'], sizes: ['10ft', '20ft'] },
                    { id: 508, name: 'Lantern', price: 59.99, oldPrice: 84.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Outdoor lantern.', rating: 4.5, reviewCount: 22, colors: ['#c53030', '#2d3748'], sizes: ['Small', 'Large'] },
                    { id: 509, name: 'Spotlight', price: 49.99, oldPrice: 74.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Adjustable spotlight.', rating: 4.3, reviewCount: 18, colors: ['#e2e8f0', '#2d3748'], sizes: ['Standard'] },
                    { id: 510, name: 'Night Light', price: 29.99, oldPrice: 44.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Smart night light.', rating: 4.7, reviewCount: 51, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Standard'] }
                ],
                decor: [
                    { id: 601, name: 'Vase', price: 49.99, oldPrice: 69.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Ceramic vase set.', rating: 4.6, reviewCount: 28, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Set of 3'] },
                    { id: 602, name: 'Wall Art', price: 89.99, oldPrice: 129.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Abstract painting.', rating: 4.7, reviewCount: 35, colors: ['#c53030', '#d69e2e'], sizes: ['Small', 'Large'] },
                    { id: 603, name: 'Candle Set', price: 39.99, oldPrice: 59.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Scented candle set.', rating: 4.8, reviewCount: 62, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Set of 3'] },
                    { id: 604, name: 'Mirror', price: 149.99, oldPrice: 209.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Round decorative mirror.', rating: 4.9, reviewCount: 47, colors: ['#d69e2e', '#e2e8f0'], sizes: ['24"', '32"'] },
                    { id: 605, name: 'Throw Blanket', price: 69.99, oldPrice: 99.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Woven throw blanket.', rating: 4.7, reviewCount: 39, colors: ['#c53030', '#4a5568'], sizes: ['Standard'] },
                    { id: 606, name: 'Cushion Cover', price: 29.99, oldPrice: 44.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 2 cushion covers.', rating: 4.5, reviewCount: 44, colors: ['#d69e2e', '#e2e8f0'], sizes: ['Set of 2'] },
                    { id: 607, name: 'Plant Pot', price: 34.99, oldPrice: 49.99, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Terracotta plant pot.', rating: 4.6, reviewCount: 31, colors: ['#c53030', '#d69e2e'], sizes: ['Small', 'Medium', 'Large'] },
                    { id: 608, name: 'Sculpture', price: 119.99, oldPrice: 169.99, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Modern abstract sculpture.', rating: 4.8, reviewCount: 23, colors: ['#d69e2e', '#2d3748'], sizes: ['Standard'] },
                    { id: 609, name: 'Photo Frame', price: 24.99, oldPrice: 39.99, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Set of 3 photo frames.', rating: 4.4, reviewCount: 26, colors: ['#e2e8f0', '#d69e2e'], sizes: ['Set of 3'] },
                    { id: 610, name: 'Decorative Tray', price: 44.99, oldPrice: 64.99, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', desc: 'Gold decorative tray.', rating: 4.7, reviewCount: 33, colors: ['#d69e2e', '#e2e8f0'], sizes: ['Standard'] }
                ]
            };

            // ============================================================
            // 2. REVIEW DATA
            // ============================================================
            const REVIEWS = [
                { id: 1, name: 'Sarah Johnson', initials: 'SJ', rating: 5, date: '2 weeks ago', title: 'Absolutely stunning!', text: 'The velvet sofa exceeded all my expectations. The color is rich and the cushions are incredibly comfortable. Delivery was fast and the packaging was excellent.', verified: true, likes: 24, liked: false },
                { id: 2, name: 'Michael Chen', initials: 'MC', rating: 5, date: '1 month ago', title: 'Premium quality', text: 'You can tell this is high-quality furniture. The craftsmanship is superb and it looks even better in person than in the photos.', verified: true, likes: 18, liked: false },
                { id: 3, name: 'Emily Rodriguez', initials: 'ER', rating: 4, date: '3 weeks ago', title: 'Great value', text: 'Beautiful piece for the price. Assembly took a bit longer than expected but the end result is worth it. Would recommend.', verified: true, likes: 12, liked: false },
                { id: 4, name: 'David Kim', initials: 'DK', rating: 5, date: '2 months ago', title: 'Perfect addition', text: 'Exactly what I was looking for. The minimalist design fits perfectly in my modern apartment. Excellent customer service too.', verified: true, likes: 31, liked: false },
                { id: 5, name: 'Lisa Thompson', initials: 'LT', rating: 4, date: '1 week ago', title: 'Very comfortable', text: 'The ergonomic design is spot on. I work from home and this chair has made a huge difference in my comfort level.', verified: true, likes: 9, liked: false }
            ];

            // ============================================================
            // 3. STATE
            // ============================================================
            let currentUser = JSON.parse(localStorage.getItem('furni_user')) || null;
            let cart = JSON.parse(localStorage.getItem('furni_cart')) || [];
            let wishlist = JSON.parse(localStorage.getItem('furni_wishlist')) || [];
            let recentlyViewed = JSON.parse(localStorage.getItem('furni_recently_viewed')) || [];
            let theme = localStorage.getItem('furni_theme') || 'light';
            let searchHistory = JSON.parse(localStorage.getItem('furni_search_history')) || [];
            let reviews = JSON.parse(localStorage.getItem('furni_reviews')) || REVIEWS;
            let quickViewQty = 1;
            let quickViewProduct = null;
            let quickViewColor = null;
            let quickViewSize = null;
            let checkoutStep = 1;
            let checkoutData = { shipping: {}, payment: {} };

            // ============================================================
            // 4. DOM REFS
            // ============================================================
            const $ = (s) => document.querySelector(s);
            const $$ = (s) => document.querySelectorAll(s);

            const productGrid = $('#productGrid');
            const recentlyViewedGrid = $('#recentlyViewedGrid');
            const recentlyViewedSection = $('#recentlyViewed');
            const cartItemsEl = $('#cartItems');
            const cartFooter = $('#cartFooter');
            const cartTotal = $('#cartTotal');
            const cartCount = $('#cartCount');
            const wishlistCount = $('#wishlistCount');
            const cartSidebar = $('#cartSidebar');
            const cartOverlay = $('#cartOverlay');
            const toast = $('#toast');
            const toastMsg = $('#toastMsg');
            const toastAction = $('#toastAction');
            const userAvatar = $('#userAvatar');
            const userNameDisplay = $('#userNameDisplay');
            const authModal = $('#authModal');
            const mobileMenu = $('#mobileMenu');
            const categoryGrid = $('#categoryGrid');
            const categoryPage = $('#categoryPage');
            const categoryPageTitle = $('#categoryPageTitle');
            const categoryProductGrid = $('#categoryProductGrid');
            const backFromCategory = $('#backFromCategory');
            const homeLink = $('#homeLink');
            const dashboardNavItem = $('#dashboardNavItem');
            const dashboardNav = $('#dashboardNav');
            const mobileDashboardNav = $('#mobileDashboardNav');
            const backToTop = $('#backToTop');
            const scrollProgress = $('#scrollProgress');
            const quickViewModal = $('#quickViewModal');
            const quickViewClose = $('#quickViewClose');
            const quickViewBody = $('#quickViewBody');
            const checkoutModal = $('#checkoutModal');
            const checkoutClose = $('#checkoutClose');
            const checkoutBody = $('#checkoutBody');
            const checkoutSteps = $('#checkoutSteps');
            const searchInput = $('#searchInput');
            const searchSuggestions = $('#searchSuggestions');
            const reviewsList = $('#reviewsList');

            // ============================================================
            // 5. HELPERS
            // ============================================================
            function saveCart() { localStorage.setItem('furni_cart', JSON.stringify(cart)); }
            function saveUser() { localStorage.setItem('furni_user', JSON.stringify(currentUser)); }
            function saveTheme() { localStorage.setItem('furni_theme', theme); }
            function saveWishlist() { localStorage.setItem('furni_wishlist', JSON.stringify(wishlist)); }
            function saveRecentlyViewed() { localStorage.setItem('furni_recently_viewed', JSON.stringify(recentlyViewed)); }
            function saveSearchHistory() { localStorage.setItem('furni_search_history', JSON.stringify(searchHistory)); }
            function saveReviews() { localStorage.setItem('furni_reviews', JSON.stringify(reviews)); }

            function showToast(msg, icon = 'fa-check-circle', actionText = null, actionFn = null) {
                toastMsg.textContent = msg;
                toast.querySelector('i').className = 'fas ' + icon;
                if (actionText && actionFn) {
                    toastAction.textContent = actionText;
                    toastAction.style.display = 'inline-block';
                    toastAction.onclick = actionFn;
                } else {
                    toastAction.style.display = 'none';
                }
                toast.classList.add('show');
                clearTimeout(toast._timer);
                toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
            }

            function getStars(rating) {
                const full = Math.floor(rating);
                const half = rating % 1 >= 0.5;
                let html = '';
                for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
                if (half) html += '<i class="fas fa-star-half-alt"></i>';
                const empty = 5 - full - (half ? 1 : 0);
                for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
                return html;
            }

            function findProductById(id) {
                let product = FEATURED.find(p => p.id === id);
                if (product) return product;
                for (let cat in CATEGORY_PRODUCTS) {
                    const found = CATEGORY_PRODUCTS[cat].find(p => p.id === id);
                    if (found) return found;
                }
                return null;
            }

            function getAllProducts() {
                let all = [...FEATURED];
                for (let cat in CATEGORY_PRODUCTS) {
                    all = all.concat(CATEGORY_PRODUCTS[cat]);
                }
                return all;
            }

            // ============================================================
            // 6. PRODUCT RENDERING
            // ============================================================
            function renderProductGrid(products, container) {
                container.innerHTML = products.map(p => {
                    const inWishlist = wishlist.includes(p.id);
                    const isNew = p.isNew || false;
                    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

                    return `
                    <div class="product-card" data-id="${p.id}">
                        <div class="product-image-wrapper">
                            ${isNew ? '<span class="sale-badge badge-new">New</span>' : ''}
                            ${discount > 0 && !isNew ? `<span class="sale-badge">-${discount}%</span>` : ''}
                            <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${p.id}">
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
                            <h3 onclick="window.handleQuickView(${p.id})">${p.name}</h3>
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
                                <button class="btn btn-small btn-success add-cart" data-id="${p.id}">
                                    <i class="fas fa-plus"></i> Add
                                </button>
                                <button class="btn btn-small btn-outline quick-view-trigger" data-id="${p.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `}).join('');

                // Attach events
                container.querySelectorAll('.add-cart').forEach(btn => {
                    btn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        const id = parseInt(this.dataset.id);
                        addToCart(id);
                    });
                });

                container.querySelectorAll('.wishlist-btn').forEach(btn => {
                    btn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        const id = parseInt(this.dataset.id);
                        toggleWishlist(id);
                    });
                });

                container.querySelectorAll('.quick-view-trigger').forEach(btn => {
                    btn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        const id = parseInt(this.dataset.id);
                        openQuickView(id);
                    });
                });
            }

            // ============================================================
            // 7. CART FUNCTIONS
            // ============================================================
            function addToCart(productId, qty = 1) {
                if (!currentUser) {
                    showToast('Please sign in first', 'fa-exclamation-circle');
                    openAuthModal('signin');
                    return;
                }
                const product = findProductById(productId);
                if (!product) return;
                const existing = cart.find(item => item.id === productId);
                if (existing) {
                    existing.qty += qty;
                } else {
                    cart.push({ id: productId, name: product.name, price: product.price, image: product.image, qty: qty });
                }
                saveCart();
                updateCartUI();
                addToRecentlyViewed(productId);
                showToast(`${product.name} added to cart`, 'fa-check-circle', 'View Cart', () => {
                    cartSidebar.classList.add('active');
                    cartOverlay.classList.add('active');
                });
            }

            function removeFromCart(productId) {
                cart = cart.filter(item => item.id !== productId);
                saveCart();
                updateCartUI();
                showToast('Item removed', 'fa-trash-alt');
            }

            function updateQuantity(productId, delta) {
                const item = cart.find(i => i.id === productId);
                if (!item) return;
                const newQty = item.qty + delta;
                if (newQty <= 0) {
                    removeFromCart(productId);
                    return;
                }
                item.qty = newQty;
                saveCart();
                updateCartUI();
            }

            function updateCartUI() {
                const count = cart.reduce((sum, i) => sum + i.qty, 0);
                cartCount.textContent = count;

                if (cart.length === 0) {
                    cartItemsEl.innerHTML = `<div class="cart-empty"><i class="fas fa-box-open"></i><p>Your cart is empty</p></div>`;
                    cartFooter.style.display = 'none';
                } else {
                    cartItemsEl.innerHTML = cart.map(item => `
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

                    cartItemsEl.querySelectorAll('.qty-dec').forEach(btn => {
                        btn.addEventListener('click', function () {
                            const id = parseInt(this.dataset.id);
                            updateQuantity(id, -1);
                        });
                    });
                    cartItemsEl.querySelectorAll('.qty-inc').forEach(btn => {
                        btn.addEventListener('click', function () {
                            const id = parseInt(this.dataset.id);
                            updateQuantity(id, 1);
                        });
                    });
                    cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
                        btn.addEventListener('click', function () {
                            const id = parseInt(this.dataset.id);
                            removeFromCart(id);
                        });
                    });

                    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
                    cartTotal.textContent = '$' + total.toFixed(2);
                    cartFooter.style.display = 'block';
                }
            }

            // ============================================================
            // 8. WISHLIST FUNCTIONS
            // ============================================================
            function toggleWishlist(productId) {
                const index = wishlist.indexOf(productId);
                if (index > -1) {
                    wishlist.splice(index, 1);
                    showToast('Removed from wishlist', 'fa-heart');
                } else {
                    wishlist.push(productId);
                    showToast('Added to wishlist!', 'fa-heart');
                }
                saveWishlist();
                updateWishlistUI();
            }

            function updateWishlistUI() {
                wishlistCount.textContent = wishlist.length;
                document.querySelectorAll('.wishlist-btn').forEach(btn => {
                    const id = parseInt(btn.dataset.id);
                    if (wishlist.includes(id)) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            // ============================================================
            // 9. RECENTLY VIEWED
            // ============================================================
            function addToRecentlyViewed(productId) {
                recentlyViewed = recentlyViewed.filter(id => id !== productId);
                recentlyViewed.unshift(productId);
                if (recentlyViewed.length > 5) {
                    recentlyViewed = recentlyViewed.slice(0, 5);
                }
                saveRecentlyViewed();
                renderRecentlyViewed();
            }

            function renderRecentlyViewed() {
                if (recentlyViewed.length === 0) {
                    recentlyViewedSection.style.display = 'none';
                    return;
                }
                recentlyViewedSection.style.display = 'block';
                const products = recentlyViewed.map(id => findProductById(id)).filter(p => p);
                renderProductGrid(products, recentlyViewedGrid);
            }

            // ============================================================
            // 10. QUICK VIEW MODAL
            // ============================================================
            function openQuickView(productId) {
                const product = findProductById(productId);
                if (!product) return;

                quickViewProduct = product;
                quickViewQty = 1;
                quickViewColor = product.colors ? product.colors[0] : null;
                quickViewSize = product.sizes ? product.sizes[0] : null;

                const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

                quickViewBody.innerHTML = `
                    <div class="quick-view-gallery">
                        <img src="${product.image}" alt="${product.name}" class="quick-view-main-image" id="quickViewMainImage">
                        <div class="quick-view-thumbnails">
                            <img src="${product.image}" alt="${product.name}" class="active" data-src="${product.image}">
                            <img src="${product.image}" alt="${product.name}" data-src="${product.image}">
                            <img src="${product.image}" alt="${product.name}" data-src="${product.image}">
                        </div>
                    </div>
                    <div class="quick-view-details">
                        <h2>${product.name}</h2>
                        <div class="quick-view-rating">
                            <span class="stars">${getStars(product.rating || 4.5)}</span>
                            <span class="review-count">${product.rating || 4.5} · ${product.reviewCount || 0} reviews</span>
                        </div>
                        <div class="quick-view-price">
                            <span class="current">$${product.price.toFixed(2)}</span>
                            ${product.oldPrice ? `<span class="old">$${product.oldPrice.toFixed(2)}</span>` : ''}
                            ${discount > 0 ? `<span class="discount">-${discount}% OFF</span>` : ''}
                        </div>
                        <div class="quick-view-desc">${product.desc}</div>

                        ${product.colors ? `
                        <div class="quick-view-option">
                            <label>Color</label>
                            <div class="color-options">
                                ${product.colors.map((c, i) => `
                                    <div class="color-option ${i === 0 ? 'active' : ''}" style="background:${c}" data-color="${c}"></div>
                                `).join('')}
                            </div>
                        </div>` : ''}

                        ${product.sizes ? `
                        <div class="quick-view-option">
                            <label>Size</label>
                            <div class="size-options">
                                ${product.sizes.map((s, i) => `
                                    <div class="size-option ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</div>
                                `).join('')}
                            </div>
                        </div>` : ''}

                        <div class="quick-view-actions">
                            <div class="qty-selector">
                                <button id="qvQtyDec">−</button>
                                <span id="qvQty">1</span>
                                <button id="qvQtyInc">+</button>
                            </div>
                            <button class="btn" id="qvAddToCart">
                                <i class="fas fa-shopping-bag"></i> Add to Cart
                            </button>
                            <button class="btn btn-outline" id="qvWishlist">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>

                        <div class="quick-view-meta">
                            <p><i class="fas fa-check-circle" style="color:var(--success);"></i> <span class="quick-view-stock">In Stock</span> — Ready to ship</p>
                            <p><i class="fas fa-truck"></i> Free shipping on orders over $500</p>
                            <p><i class="fas fa-undo"></i> 30-day return policy</p>
                        </div>
                    </div>
                `;

                quickViewModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                addToRecentlyViewed(productId);

                // Attach events
                const qvQtyEl = document.getElementById('qvQty');
                document.getElementById('qvQtyDec').addEventListener('click', () => {
                    if (quickViewQty > 1) {
                        quickViewQty--;
                        qvQtyEl.textContent = quickViewQty;
                    }
                });
                document.getElementById('qvQtyInc').addEventListener('click', () => {
                    quickViewQty++;
                    qvQtyEl.textContent = quickViewQty;
                });

                document.getElementById('qvAddToCart').addEventListener('click', () => {
                    addToCart(productId, quickViewQty);
                    closeQuickView();
                });

                document.getElementById('qvWishlist').addEventListener('click', () => {
                    toggleWishlist(productId);
                    const btn = document.getElementById('qvWishlist');
                    if (wishlist.includes(productId)) {
                        btn.style.color = 'var(--danger)';
                    } else {
                        btn.style.color = '';
                    }
                });

                // Color options
                quickViewBody.querySelectorAll('.color-option').forEach(opt => {
                    opt.addEventListener('click', function () {
                        quickViewBody.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
                        this.classList.add('active');
                        quickViewColor = this.dataset.color;
                    });
                });

                // Size options
                quickViewBody.querySelectorAll('.size-option').forEach(opt => {
                    opt.addEventListener('click', function () {
                        quickViewBody.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
                        this.classList.add('active');
                        quickViewSize = this.dataset.size;
                    });
                });

                // Thumbnails
                quickViewBody.querySelectorAll('.quick-view-thumbnails img').forEach(thumb => {
                    thumb.addEventListener('click', function () {
                        quickViewBody.querySelectorAll('.quick-view-thumbnails img').forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                        document.getElementById('quickViewMainImage').src = this.dataset.src;
                    });
                });
            }

            function closeQuickView() {
                quickViewModal.classList.remove('active');
                document.body.style.overflow = '';
            }

            window.handleQuickView = openQuickView;

            // ============================================================
            // 11. SEARCH WITH AUTOCOMPLETE
            // ============================================================
            function handleSearch(query) {
                if (!query.trim()) {
                    searchSuggestions.classList.remove('active');
                    return;
                }

                const allProducts = getAllProducts();
                const q = query.toLowerCase().trim();

                const matches = allProducts.filter(p =>
                    p.name.toLowerCase().includes(q) ||
                    p.desc.toLowerCase().includes(q)
                ).slice(0, 6);

                if (matches.length === 0) {
                    searchSuggestions.innerHTML = `
                        <div class="search-no-results">
                            <i class="fas fa-search" style="font-size:1.5rem;opacity:0.4;display:block;margin-bottom:0.5rem;"></i>
                            No results for "${query}"
                        </div>
                    `;
                    searchSuggestions.classList.add('active');
                    return;
                }

                searchSuggestions.innerHTML = `
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

                searchSuggestions.classList.add('active');

                searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', function () {
                        const id = parseInt(this.dataset.id);
                        openQuickView(id);
                        searchSuggestions.classList.remove('active');
                        searchInput.value = '';
                    });
                });
            }

            // ============================================================
            // 12. CHECKOUT FLOW
            // ============================================================
            function openCheckout() {
                if (!currentUser) {
                    showToast('Please sign in to checkout', 'fa-exclamation-circle');
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
                    setTimeout(() => openAuthModal('signin'), 300);
                    return;
                }
                if (cart.length === 0) {
                    showToast('Your cart is empty', 'fa-exclamation-circle');
                    return;
                }
                checkoutStep = 1;
                checkoutData = { shipping: {}, payment: {} };
                renderCheckoutStep();
                checkoutModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
            }

            function closeCheckout() {
                checkoutModal.classList.remove('active');
                document.body.style.overflow = '';
            }

            function renderCheckoutStep() {
                // Update steps UI
                checkoutSteps.querySelectorAll('.checkout-step').forEach(step => {
                    const stepNum = parseInt(step.dataset.step);
                    step.classList.remove('active', 'completed');
                    if (stepNum === checkoutStep) step.classList.add('active');
                    if (stepNum < checkoutStep) step.classList.add('completed');
                });

                const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
                const shipping = total > 500 ? 0 : 25;
                const tax = total * 0.08;
                const grandTotal = total + shipping + tax;

                if (checkoutStep === 1) {
                    // Cart Review
                    checkoutBody.innerHTML = `
                        <div class="checkout-panel active">
                            <h3><i class="fas fa-shopping-bag"></i> Review Your Cart</h3>
                            <div class="checkout-summary">
                                ${cart.map(item => `
                                    <div class="checkout-summary-item">
                                        <span>${item.name} × ${item.qty}</span>
                                        <span>$${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                `).join('')}
                                <div class="checkout-summary-item total">
                                    <span>Subtotal</span>
                                    <span>$${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div class="checkout-actions">
                                <button class="btn btn-outline" onclick="closeCheckout()">Continue Shopping</button>
                                <button class="btn" onclick="window.goToCheckoutStep(2)">Next: Shipping <i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                    `;
                } else if (checkoutStep === 2) {
                    // Shipping
                    const s = checkoutData.shipping || {};
                    checkoutBody.innerHTML = `
                        <div class="checkout-panel active">
                            <h3><i class="fas fa-truck"></i> Shipping Information</h3>
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" id="shipName" value="${s.name || ''}" placeholder="John Doe" required>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="shipEmail" value="${s.email || ''}" placeholder="you@example.com" required>
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="tel" id="shipPhone" value="${s.phone || ''}" placeholder="+1 (555) 000-0000" required>
                            </div>
                            <div class="form-group">
                                <label>Street Address</label>
                                <input type="text" id="shipStreet" value="${s.street || ''}" placeholder="123 Main St" required>
                            </div>
                            <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                                <div class="form-group">
                                    <label>City</label>
                                    <input type="text" id="shipCity" value="${s.city || ''}" placeholder="City" required>
                                </div>
                                <div class="form-group">
                                    <label>State</label>
                                    <input type="text" id="shipState" value="${s.state || ''}" placeholder="State" required>
                                </div>
                            </div>
                            <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                                <div class="form-group">
                                    <label>ZIP Code</label>
                                    <input type="text" id="shipZip" value="${s.zip || ''}" placeholder="ZIP" required>
                                </div>
                                <div class="form-group">
                                    <label>Country</label>
                                    <input type="text" id="shipCountry" value="${s.country || 'USA'}" placeholder="Country" required>
                                </div>
                            </div>
                            <div class="checkout-actions">
                                <button class="btn btn-outline" onclick="window.goToCheckoutStep(1)"><i class="fas fa-arrow-left"></i> Back</button>
                                <button class="btn" onclick="window.saveShippingAndNext()">Next: Payment <i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                    `;
                } else if (checkoutStep === 3) {
                    // Payment
                    const p = checkoutData.payment || {};
                    checkoutBody.innerHTML = `
                        <div class="checkout-panel active">
                            <h3><i class="fas fa-credit-card"></i> Payment Method</h3>
                            <div class="payment-methods">
                                <div class="payment-method ${!p.method || p.method === 'card' ? 'active' : ''}" data-method="card">
                                    <i class="fas fa-credit-card"></i>
                                    <div class="payment-info">
                                        <div class="name">Credit / Debit Card</div>
                                        <div class="desc">Visa, Mastercard, Amex</div>
                                    </div>
                                    <i class="fas fa-check-circle" style="color:var(--primary);"></i>
                                </div>
                                <div class="payment-method ${p.method === 'paypal' ? 'active' : ''}" data-method="paypal">
                                    <i class="fab fa-paypal"></i>
                                    <div class="payment-info">
                                        <div class="name">PayPal</div>
                                        <div class="desc">Pay with your PayPal account</div>
                                    </div>
                                </div>
                                <div class="payment-method ${p.method === 'cod' ? 'active' : ''}" data-method="cod">
                                    <i class="fas fa-money-bill-wave"></i>
                                    <div class="payment-info">
                                        <div class="name">Cash on Delivery</div>
                                        <div class="desc">Pay when your order arrives</div>
                                    </div>
                                </div>
                            </div>
                            <div id="cardDetails" style="${p.method === 'paypal' || p.method === 'cod' ? 'display:none;' : ''}">
                                <div class="form-group">
                                    <label>Card Number</label>
                                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" value="${p.cardNumber || ''}">
                                </div>
                                <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                                    <div class="form-group">
                                        <label>Expiry</label>
                                        <input type="text" id="cardExpiry" placeholder="MM/YY" value="${p.cardExpiry || ''}">
                                    </div>
                                    <div class="form-group">
                                        <label>CVV</label>
                                        <input type="text" id="cardCvv" placeholder="123" value="${p.cardCvv || ''}">
                                    </div>
                                </div>
                            </div>
                            <div class="checkout-actions">
                                <button class="btn btn-outline" onclick="window.goToCheckoutStep(2)"><i class="fas fa-arrow-left"></i> Back</button>
                                <button class="btn" onclick="window.savePaymentAndNext()">Review Order <i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                    `;

                    // Payment method selection
                    checkoutBody.querySelectorAll('.payment-method').forEach(method => {
                        method.addEventListener('click', function () {
                            checkoutBody.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
                            this.classList.add('active');
                            const methodType = this.dataset.method;
                            checkoutData.payment.method = methodType;
                            const cardDetails = document.getElementById('cardDetails');
                            if (cardDetails) {
                                cardDetails.style.display = methodType === 'card' ? 'block' : 'none';
                            }
                        });
                    });
                } else if (checkoutStep === 4) {
                    // Confirm
                    const s = checkoutData.shipping || {};
                    const p = checkoutData.payment || { method: 'card' };
                    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
                    const shipping = total > 500 ? 0 : 25;
                    const tax = total * 0.08;
                    const grandTotal = total + shipping + tax;

                    checkoutBody.innerHTML = `
                        <div class="checkout-panel active">
                            <h3><i class="fas fa-check-circle"></i> Confirm Your Order</h3>
                            <div class="checkout-summary">
                                <div style="margin-bottom:1rem;">
                                    <strong>Shipping to:</strong><br>
                                    ${s.name}<br>
                                    ${s.street}<br>
                                    ${s.city}, ${s.state} ${s.zip}<br>
                                    ${s.country}
                                </div>
                                <div style="margin-bottom:1rem;">
                                    <strong>Payment:</strong> ${p.method === 'card' ? 'Credit/Debit Card' : p.method === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
                                </div>
                                ${cart.map(item => `
                                    <div class="checkout-summary-item">
                                        <span>${item.name} × ${item.qty}</span>
                                        <span>$${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                `).join('')}
                                <div class="checkout-summary-item"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div>
                                <div class="checkout-summary-item"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span></div>
                                <div class="checkout-summary-item"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
                                <div class="checkout-summary-item total"><span>Total</span><span>$${grandTotal.toFixed(2)}</span></div>
                            </div>
                            <div class="checkout-actions">
                                <button class="btn btn-outline" onclick="window.goToCheckoutStep(3)"><i class="fas fa-arrow-left"></i> Back</button>
                                <button class="btn btn-success" onclick="window.placeOrder()">
                                    <i class="fas fa-lock"></i> Place Order — $${grandTotal.toFixed(2)}
                                </button>
                            </div>
                        </div>
                    `;
                }
            }

            window.goToCheckoutStep = function (step) {
                checkoutStep = step;
                renderCheckoutStep();
            };

            window.saveShippingAndNext = function () {
                const name = document.getElementById('shipName')?.value.trim();
                const email = document.getElementById('shipEmail')?.value.trim();
                const phone = document.getElementById('shipPhone')?.value.trim();
                const street = document.getElementById('shipStreet')?.value.trim();
                const city = document.getElementById('shipCity')?.value.trim();
                const state = document.getElementById('shipState')?.value.trim();
                const zip = document.getElementById('shipZip')?.value.trim();
                const country = document.getElementById('shipCountry')?.value.trim();

                if (!name || !email || !street || !city || !state || !zip) {
                    showToast('Please fill in all required fields', 'fa-exclamation-circle');
                    return;
                }

                checkoutData.shipping = { name, email, phone, street, city, state, zip, country };
                checkoutStep = 3;
                renderCheckoutStep();
            };

            window.savePaymentAndNext = function () {
                const method = checkoutData.payment.method || 'card';
                if (method === 'card') {
                    const cardNumber = document.getElementById('cardNumber')?.value.trim();
                    const cardExpiry = document.getElementById('cardExpiry')?.value.trim();
                    const cardCvv = document.getElementById('cardCvv')?.value.trim();
                    if (!cardNumber || !cardExpiry || !cardCvv) {
                        showToast('Please fill in card details', 'fa-exclamation-circle');
                        return;
                    }
                    checkoutData.payment = { method, cardNumber, cardExpiry, cardCvv };
                } else {
                    checkoutData.payment = { method };
                }
                checkoutStep = 4;
                renderCheckoutStep();
            };

            window.placeOrder = function () {
                const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
                const shipping = total > 500 ? 0 : 25;
                const tax = total * 0.08;
                const grandTotal = total + shipping + tax;

                const orderId = 'ORD-' + Date.now().toString().slice(-6);

                const order = {
                    id: orderId,
                    date: new Date().toISOString(),
                    items: cart.reduce((sum, item) => sum + item.qty, 0),
                    total: grandTotal,
                    status: 'processing',
                    shipping: checkoutData.shipping,
                    payment: checkoutData.payment.method
                };

                // Save to user data
                if (currentUser) {
                    const key = `furni_userdata_${currentUser.email}`;
                    const userData = JSON.parse(localStorage.getItem(key)) || { addresses: [], orders: [], phone: '', profile: {} };
                    userData.orders = userData.orders || [];
                    userData.orders.unshift(order);
                    localStorage.setItem(key, JSON.stringify(userData));
                }

                // Show success
                checkoutBody.innerHTML = `
                    <div class="checkout-panel active">
                        <div class="order-success">
                            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                            <h3>Order Placed Successfully!</h3>
                            <p>Thank you for your purchase. We've sent a confirmation email to you.</p>
                            <div class="order-number">Order #${orderId}</div>
                            <p style="font-size:0.9rem;">Estimated delivery: <strong>${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong></p>
                            <button class="btn" style="margin-top:1rem;" onclick="closeCheckout()">
                                <i class="fas fa-check"></i> Continue Shopping
                            </button>
                        </div>
                    </div>
                `;

                // Clear cart
                cart = [];
                saveCart();
                updateCartUI();

                showToast('Order placed successfully!', 'fa-check-circle');
            };

            window.closeCheckout = closeCheckout;

            // ============================================================
            // 13. REVIEWS RENDERING
            // ============================================================
            function renderReviews() {
                if (!reviewsList) return;
                reviewsList.innerHTML = reviews.map(review => `
                    <div class="review-card" data-review-id="${review.id}">
                        <div class="review-header">
                            <div class="review-avatar">${review.initials}</div>
                            <div class="review-info">
                                <div class="name">${review.name}${review.verified ? ' <span class="verified"><i class="fas fa-check-circle"></i> Verified</span>' : ''}</div>
                                <div class="date">${review.date}</div>
                            </div>
                        </div>
                        <div class="review-stars">${getStars(review.rating)}</div>
                        <div class="review-title">${review.title}</div>
                        <div class="review-text">${review.text}</div>
                        <div class="review-actions">
                            <button class="like-review ${review.liked ? 'liked' : ''}" data-id="${review.id}">
                                <i class="fas fa-thumbs-up"></i> Helpful (${review.likes})
                            </button>
                            <button><i class="fas fa-flag"></i> Report</button>
                        </div>
                    </div>
                `).join('');

                reviewsList.querySelectorAll('.like-review').forEach(btn => {
                    btn.addEventListener('click', function () {
                        const id = parseInt(this.dataset.id);
                        const review = reviews.find(r => r.id === id);
                        if (review) {
                            if (review.liked) {
                                review.likes--;
                                review.liked = false;
                            } else {
                                review.likes++;
                                review.liked = true;
                            }
                            saveReviews();
                            renderReviews();
                        }
                    });
                });
            }

            // ============================================================
            // 14. FLASH SALE TIMER
            // ============================================================
            function startFlashSaleTimer() {
                // 8 hours from now
                const endTime = new Date();
                endTime.setHours(endTime.getHours() + 8);
                endTime.setMinutes(endTime.getMinutes() + 45);
                endTime.setSeconds(endTime.getSeconds() + 30);

                function updateTimer() {
                    const now = new Date().getTime();
                    const distance = endTime.getTime() - now;

                    if (distance < 0) {
                        document.getElementById('flashHours').textContent = '00';
                        document.getElementById('flashMinutes').textContent = '00';
                        document.getElementById('flashSeconds').textContent = '00';
                        return;
                    }

                    const hours = Math.floor(distance / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    document.getElementById('flashHours').textContent = String(hours).padStart(2, '0');
                    document.getElementById('flashMinutes').textContent = String(minutes).padStart(2, '0');
                    document.getElementById('flashSeconds').textContent = String(seconds).padStart(2, '0');
                }

                updateTimer();
                setInterval(updateTimer, 1000);
            }

            // ============================================================
            // 15. AUTH FUNCTIONS
            // ============================================================
            function openAuthModal(tab = 'signin') {
                authModal.classList.add('active');
                const tabs = authModal.querySelectorAll('.auth-tabs button');
                const forms = authModal.querySelectorAll('.auth-form');
                tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
                forms.forEach(f => f.classList.toggle('active', f.id === (tab === 'signin' ? 'formSignin' : 'formSignup')));
                document.body.style.overflow = 'hidden';
            }

            function closeAuthModal() {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
            }

            function updateUserUI() {
                if (currentUser) {
                    const name = currentUser.name.split(' ')[0];
                    userNameDisplay.textContent = name;
                    userAvatar.innerHTML = `<i class="fas fa-user-circle"></i><span>${name}</span>`;
                    dashboardNavItem.style.display = 'block';
                    mobileDashboardNav.style.display = 'block';
                } else {
                    userNameDisplay.textContent = 'Sign in';
                    userAvatar.innerHTML = `<i class="fas fa-user-circle"></i><span>Sign in</span>`;
                    dashboardNavItem.style.display = 'none';
                    mobileDashboardNav.style.display = 'none';
                }
            }

            // ============================================================
            // 16. CATEGORY PAGE
            // ============================================================
            function showCategoryPage(categoryKey) {
                const products = CATEGORY_PRODUCTS[categoryKey];
                if (!products) return;

                document.getElementById('mainSections').style.display = 'none';
                document.querySelector('.newsletter-section').style.display = 'none';
                document.querySelector('footer').style.display = 'none';
                categoryPage.classList.add('active');

                const displayName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
                categoryPageTitle.innerHTML = `${displayName} <span>Collection</span>`;

                renderProductGrid(products, categoryProductGrid);
                categoryPage.scrollIntoView({ behavior: 'smooth' });
            }

            function hideCategoryPage() {
                categoryPage.classList.remove('active');
                document.getElementById('mainSections').style.display = '';
                document.querySelector('.newsletter-section').style.display = '';
                document.querySelector('footer').style.display = '';
                document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
            }

            // ============================================================
            // 17. NAVIGATION
            // ============================================================
            function handleNavClick(e) {
                const target = e.currentTarget;
                const href = target.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    if (categoryPage.classList.contains('active')) hideCategoryPage();
                    const section = document.querySelector(href);
                    if (section) {
                        const headerHeight = document.querySelector('header').offsetHeight + document.getElementById('flashSaleBanner').offsetHeight;
                        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                }
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

                // Render products
                renderProductGrid(FEATURED, productGrid);
                renderRecentlyViewed();
                renderReviews();
                updateCartUI();
                updateUserUI();
                updateWishlistUI();
                startFlashSaleTimer();

                // Search
                searchInput.addEventListener('input', function () {
                    handleSearch(this.value);
                });
                searchInput.addEventListener('focus', function () {
                    if (this.value.trim()) handleSearch(this.value);
                });
                document.addEventListener('click', function (e) {
                    if (!e.target.closest('.search-wrapper')) {
                        searchSuggestions.classList.remove('active');
                    }
                });
                document.getElementById('searchBtn').addEventListener('click', function () {
                    const q = searchInput.value.trim();
                    if (q) {
                        const allProducts = getAllProducts();
                        const matches = allProducts.filter(p =>
                            p.name.toLowerCase().includes(q.toLowerCase())
                        );
                        if (matches.length > 0) {
                            document.getElementById('mainSections').style.display = 'none';
                            document.querySelector('.newsletter-section').style.display = 'none';
                            document.querySelector('footer').style.display = 'none';
                            categoryPage.classList.add('active');
                            categoryPageTitle.innerHTML = `Search: <span>${q}</span>`;
                            renderProductGrid(matches, categoryProductGrid);
                            searchSuggestions.classList.remove('active');
                        } else {
                            showToast('No products found', 'fa-search');
                        }
                    }
                });

                // Navigation
                document.querySelectorAll('.nav-links a, .mobile-menu a[href^="#"]').forEach(link => {
                    link.addEventListener('click', handleNavClick);
                });

                // Home link
                homeLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (categoryPage.classList.contains('active')) hideCategoryPage();
                    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                });

                // Categories
                categoryGrid.querySelectorAll('.category-card').forEach(card => {
                    card.addEventListener('click', function () {
                        const cat = this.dataset.category;
                        showCategoryPage(cat);
                    });
                });

                // Back from category
                backFromCategory.addEventListener('click', hideCategoryPage);

                // Wishlist open
                document.getElementById('wishlistOpen').addEventListener('click', function () {
                    if (wishlist.length === 0) {
                        showToast('Your wishlist is empty', 'fa-heart');
                        return;
                    }
                    showToast(`${wishlist.length} items in wishlist`, 'fa-heart');
                });

                // Cart
                document.getElementById('cartOpen').addEventListener('click', () => {
                    cartSidebar.classList.add('active');
                    cartOverlay.classList.add('active');
                });
                document.getElementById('cartClose').addEventListener('click', () => {
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
                });
                cartOverlay.addEventListener('click', () => {
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
                });

                // Theme toggle
                document.getElementById('themeToggle').addEventListener('click', function () {
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    if (isDark) {
                        document.documentElement.removeAttribute('data-theme');
                        this.querySelector('i').className = 'fas fa-moon';
                        theme = 'light';
                    } else {
                        document.documentElement.setAttribute('data-theme', 'dark');
                        this.querySelector('i').className = 'fas fa-sun';
                        theme = 'dark';
                    }
                    saveTheme();
                });

                // User avatar
                userAvatar.addEventListener('click', function (e) {
                    e.stopPropagation();
                    if (currentUser) {
                        window.location.hash = '#dashboard';
                    } else {
                        openAuthModal('signin');
                    }
                });

                // Auth modal
                document.getElementById('authClose').addEventListener('click', closeAuthModal);
                authModal.addEventListener('click', function (e) { if (e.target === this) closeAuthModal(); });
                authModal.querySelectorAll('.auth-tabs button').forEach(btn => {
                    btn.addEventListener('click', function () { openAuthModal(this.dataset.tab); });
                });
                document.getElementById('switchToSignup').addEventListener('click', () => openAuthModal('signup'));
                document.getElementById('switchToSignin').addEventListener('click', () => openAuthModal('signin'));

                // Mobile sign in/out
                document.querySelector('#mobileMenu .btn-outline')?.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (currentUser) {
                        currentUser = null;
                        localStorage.removeItem('furni_user');
                        updateUserUI();
                        showToast('Signed out', 'fa-sign-out-alt');
                        mobileMenu.classList.remove('active');
                    } else {
                        openAuthModal('signin');
                        mobileMenu.classList.remove('active');
                    }
                });

                // Sign in
                document.getElementById('signinForm').addEventListener('submit', function (e) {
                    e.preventDefault();
                    const email = document.getElementById('signinEmail').value.trim();
                    const password = document.getElementById('signinPassword').value.trim();
                    if (!email || !password) { showToast('Please fill in all fields', 'fa-exclamation-circle'); return; }
                    const users = JSON.parse(localStorage.getItem('furni_users')) || [];
                    const found = users.find(u => u.email === email && u.password === password);
                    if (found) {
                        currentUser = { name: found.name, email: found.email };
                        saveUser();
                        updateUserUI();
                        closeAuthModal();
                        showToast(`Welcome back, ${found.name.split(' ')[0]}!`);
                        this.reset();
                    } else {
                        showToast('Invalid email or password', 'fa-exclamation-circle');
                    }
                });

                // Sign up
                document.getElementById('signupForm').addEventListener('submit', function (e) {
                    e.preventDefault();
                    const name = document.getElementById('signupName').value.trim();
                    const email = document.getElementById('signupEmail').value.trim();
                    const password = document.getElementById('signupPassword').value.trim();
                    if (!name || !email || !password || password.length < 6) {
                        showToast('Please fill all fields (password min 6)', 'fa-exclamation-circle');
                        return;
                    }
                    const users = JSON.parse(localStorage.getItem('furni_users')) || [];
                    if (users.find(u => u.email === email)) {
                        showToast('Email already registered', 'fa-exclamation-circle');
                        return;
                    }
                    users.push({ name, email, password });
                    localStorage.setItem('furni_users', JSON.stringify(users));
                    currentUser = { name, email };
                    saveUser();
                    updateUserUI();
                    closeAuthModal();
                    showToast(`Welcome, ${name.split(' ')[0]}!`);
                    this.reset();

                    const key = `furni_userdata_${email}`;
                    if (!localStorage.getItem(key)) {
                        localStorage.setItem(key, JSON.stringify({
                            addresses: [],
                            orders: [],
                            phone: '',
                            profile: { name, email }
                        }));
                    }
                });

                // Checkout button
                document.getElementById('checkoutBtn').addEventListener('click', openCheckout);

                // Quick view close
                quickViewClose.addEventListener('click', closeQuickView);
                quickViewModal.addEventListener('click', function (e) { if (e.target === this) closeQuickView(); });

                // Checkout close
                checkoutClose.addEventListener('click', closeCheckout);
                checkoutModal.addEventListener('click', function (e) { if (e.target === this) closeCheckout(); });

                // Hamburger
                document.getElementById('hamburgerBtn').addEventListener('click', function () {
                    mobileMenu.classList.toggle('active');
                    this.querySelector('i').className = mobileMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
                });
                mobileMenu.querySelectorAll('a').forEach(a => {
                    a.addEventListener('click', () => {
                        mobileMenu.classList.remove('active');
                        document.querySelector('#hamburgerBtn i').className = 'fas fa-bars';
                    });
                });

                // Contact
                document.getElementById('contactForm').addEventListener('submit', function (e) {
                    e.preventDefault();
                    showToast('Message sent! We\'ll reply soon.', 'fa-paper-plane');
                    this.reset();
                });

                // Newsletter
                document.getElementById('newsletterForm').addEventListener('submit', function (e) {
                    e.preventDefault();
                    const email = this.querySelector('input').value.trim();
                    if (email) {
                        showToast('Subscribed successfully!', 'fa-envelope');
                        this.reset();
                    }
                });

                // Scroll events
                window.addEventListener('scroll', function () {
                    const scrollTop = window.pageYOffset;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                    scrollProgress.style.width = scrollPercent + '%';

                    if (scrollTop > 300) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                });

                backToTop.addEventListener('click', function () {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });

                // Escape key
                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape') {
                        if (cartSidebar.classList.contains('active')) {
                            cartSidebar.classList.remove('active');
                            cartOverlay.classList.remove('active');
                        }
                        if (authModal.classList.contains('active')) closeAuthModal();
                        if (quickViewModal.classList.contains('active')) closeQuickView();
                        if (checkoutModal.classList.contains('active')) closeCheckout();
                        if (categoryPage.classList.contains('active')) hideCategoryPage();
                        searchSuggestions.classList.remove('active');
                    }
                });

                // Flash sale progress (simulate)
                let progress = 65;
                setInterval(() => {
                    if (progress < 95) {
                        progress += Math.random() * 2;
                        if (progress > 95) progress = 95;
                        document.getElementById('flashProgressBar').style.width = progress + '%';
                        document.getElementById('flashClaimed').textContent = Math.round(progress) + '% claimed';
                    }
                }, 8000);
            }

            document.addEventListener('DOMContentLoaded', init);
        })();
    </script>
