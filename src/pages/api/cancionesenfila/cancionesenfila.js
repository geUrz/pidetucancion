import connection from "@/libs/db"

export default async function handler(req, res) {
    const { id, search } = req.query;

    if (req.method === 'GET') {
        if (id) {
            // Obtener un cliente por ID
            try {
                const [rows] = await connection.query('SELECT id, usuario_id, cancion, cantante, nombre, mensaje, createdAt FROM cancionesenfila WHERE id = ?', [id])

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
                            usuario_id,
                            cancion, 
                            nombre,
                            cantante,
                            mensaje,
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
                const [rows] = await connection.query('SELECT id, usuario_id, cancion, nombre, cantante,  mensaje, createdAt FROM cancionesenfila ORDER BY createdAt ASC');
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        
    } else if (req.method === 'POST') {
        try {
            const { usuario_id, cancion, cantante, nombre, mensaje } = req.body;
            if (!usuario_id && !cancion) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' });
            }
    
            // Inserta la nueva canción en la base de datos
            const [result] = await connection.query('INSERT INTO cancionesenfila (usuario_id, cancion, cantante, nombre, mensaje) VALUES (?, ?, ?, ?, ?)', [usuario_id, cancion, cantante, nombre, mensaje]);
            
            // Una vez insertada, obtén el id generado y los datos completos de la canción
            const [rows] = await connection.query('SELECT id, usuario_id, cancion, cantante, nombre, mensaje, createdAt FROM cancionesenfila WHERE id = ?', [result.insertId]);
            
            // Devuelve toda la canción con los datos que acabas de insertar, incluyendo el id
            const nuevaCancion = rows[0];
    
            res.status(201).json(nuevaCancion);  // Devolver la canción completa con el id
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID de la canción es obligatorio' })
        }

        const { cancion, cantante, nombre, mensaje } = req.body

        if (!cancion) {
            return res.status(400).json({ error: 'Todos los datos son obligatorios' })
        }

        try {
            const [result] = await connection.query('UPDATE cancionesenfila SET cancion = ?, cantante = ?, nombre = ?, mensaje = ? WHERE id = ?', [cancion, cantante, nombre, mensaje, id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Canción no encontrada' })
            }

            res.status(200).json({ message: 'Canción actualizada correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        const { usuario_id, id } = req.query;

        if (usuario_id) {
            // Eliminar todas las canciones de un usuario
            try {
                const [result] = await connection.query(
                    'DELETE FROM cancionesenfila WHERE usuario_id = ?',
                    [usuario_id]
                );

                if (result.affectedRows > 0) {
                    res.status(200).json({ message: 'Todas las canciones del usuario fueron eliminadas correctamente' });
                } else {
                    res.status(404).json({ message: 'No se encontraron canciones para eliminar' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else if (id) {
            // Eliminar una canción por ID
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
            // Si no se proporciona ni 'id' ni 'usuario_id', devolver un error.
            res.status(400).json({ error: 'Se debe proporcionar un id o usuario_id' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
