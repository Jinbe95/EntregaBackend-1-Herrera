import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Ticket from '../models/Ticket.js';

//---------------------------------------
// purchaseCartHandler (usuario logueado)
//---------------------------------------

export const purchaseCartHandler = async (req, res) => {
    try {
        const userId = req.user && (req.user.id || req.user._id);

        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        // Buscar carrito del usuario
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'El carrito está vacío'
            });
        }

        const unavailable = [];
        const purchasable = [];

        // Clasificar los productos
        for (const item of cart.items) {
            if (item.product.stock >= item.quantity) {
                purchasable.push(item);
            } else {
                unavailable.push({
                    product: item.product._id,
                    requested: item.quantity,
                    stock: item.product.stock
                });
            }
        }

        // Si no hay productos comprables, no generar ticket
        if (purchasable.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'No hay productos con stock suficiente',
                unavailable
            });
        }

        // Descontar stock
        for (const item of purchasable) {
            const product = await Product.findById(item.product._id);
            product.stock -= item.quantity;
            await product.save();
        }

        // Crear ticket
        const amount = purchasable.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        const ticket = await Ticket.create({
            amount,
            purchaser: userId
        });

        // eliminar los items comprados del carrito
        cart.items = cart.items.filter(
            i => !purchasable.find(p => String(p.product._id) === String(i.product._id))
        );

        await cart.save();

        return res.json({
            status: 'success',
            ticket,
            unavailable
        });

    } catch (error) {
        console.error('purchaseCartHandler error', error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export default { purchaseCartHandler };
