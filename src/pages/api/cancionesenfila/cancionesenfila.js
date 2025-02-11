import connection from "@/libs/db"

export default async function handler(req, res) {
    const { id, search } = req.query;

    if (req.method === 'GET') {
        if (id) {
            // Obtener un cliente por ID
            try {
                const [rows] = await connection.query('SELECT id, cancion, nombre, mensaje, estado, createdAt FROM cancionesenfila WHERE id = ?', [id])

                if (rows.length === 0) {
                    /* return res.status(404).json({ error: 'Cliente no encontrado' }); */
                }

                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }

            return
        }

            if (search) {
                const searchQuery = `%${search.toLowerCase()}%`;
                try {
                    const [rows] = await connection.query(`
                        SELECT
                            id, 
                            cancion, 
                            nombre,
                            mensaje,
                            estado,
                            createdAt
                        FROM cancionesenfila
                        WHERE 
                            LOWER(cancion) LIKE ? 
                        OR 
                            LOWER(nombre) LIKE ?
                        ORDER BY createdAt DESC`, [searchQuery, searchQuery]);
    
                    res.status(200).json(rows); // Devolver los recibos encontrados por búsqueda
    
                } catch (error) {
                    res.status(500).json({ error: 'Error al realizar la búsqueda' });
                }
                return;
            }

            // Obtener todos los cancionesenfila
            try {
                const [rows] = await connection.query('SELECT id, cancion, nombre, mensaje, estado, createdAt FROM cancionesenfila ORDER BY createdAt ASC');
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        
    } else if (req.method === 'POST') {
        try {
            const { cancion, nombre, mensaje, estado } = req.body
            if (!cancion ) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query('INSERT INTO cancionesenfila (cancion, nombre, mensaje, estado) VALUES (?, ?, ?, ?)', [cancion, nombre, mensaje, estado])
            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la canción es obligatorio' })
        }

        const { cancion, nombre, mensaje, estado } = req.body

        if (!cancion) {
            return res.status(400).json({ error: 'Todos los datos son obligatorios' })
        }

        try {
            const [result] = await connection.query('UPDATE cancionesenfila SET cancion = ?, nombre = ?, mensaje = ?, estado = ? WHERE id = ?', [cancion, nombre, mensaje, estado, id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Canción no encontrada' })
            }

            res.status(200).json({ message: 'Canción actualizada correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        try {
            const [result] = await connection.query(
                'DELETE FROM cancionesenfila WHERE id = ?',
                [id]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Canción eliminada correctamente' });
            } else {
                res.status(404).json({ message: 'Canción no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
