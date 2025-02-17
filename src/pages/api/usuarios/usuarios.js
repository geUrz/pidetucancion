import connection from "@/libs/db";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    const { id, cantante_id } = req.query;

    if (req.method === 'GET') {
        
        if (cantante_id) {

            try {
                const [rows] = await connection.query(
                    `SELECT id, cantante_id, folio, nombre, usuario, email, nivel, isactive 
                     FROM usuarios 
                     WHERE cantante_id = ?`,
                    [cantante_id]
                );

                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }

        if (id) {
            try {
                const [rows] = await connection.query(
                    'SELECT id, cantante_id, nombre, usuario, email, nivel, isactive FROM usuarios WHERE id = ?',
                    [id]
                );

                res.status(200).json(rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            try {
                const [rows] = await connection.query(
                    `SELECT id, cantante_id, folio, nombre, usuario, email, nivel, isactive 
                     FROM usuarios 
                     ORDER BY updatedAt DESC`
                );
                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    } else if (req.method === 'POST') {
        const { folio, nombre, usuario, email, nivel, isactive, password, cantante_id } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Se requiere una contraseña' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await connection.query(
            `INSERT INTO usuarios (folio, nombre, usuario, email, nivel, isactive, password, cantante_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [folio, nombre, usuario, email, nivel, isactive, hashedPassword, cantante_id]
        );

        res.status(201).json({ id: result.insertId, folio, nombre, usuario, email, nivel, isactive, cantante_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    } else if (req.method === 'PUT') {
        if (!id) {
            return res.status(400).json({ error: 'ID del usuario es necesario para actualizar' });
        }

        const { nombre, usuario, email, nivel, isactive, newPassword } = req.body;

        let updateData = { nombre, usuario, email, nivel, isactive };

        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        try {
            const [result] = await connection.query(
                `UPDATE usuarios 
                 SET nombre = ?, usuario = ?, email = ?, nivel = ?, isactive = ?, password = ?
                 WHERE id = ?`,
                [
                    updateData.nombre, 
                    updateData.usuario, 
                    updateData.email, 
                    updateData.nivel, 
                    updateData.isactive, 
                    updateData.password || null, 
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json({ id, ...updateData });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'DELETE') {
        if (!id) {
            return res.status(400).json({ error: 'ID del usuario es necesario para eliminar' });
        }

        try {
            const [result] = await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
