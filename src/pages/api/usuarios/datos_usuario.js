import connection from "@/libs/db";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    const { id, usuario_id } = req.query;

    if (req.method === 'GET') {
        if (usuario_id) {
            try {
                const [rows] = await connection.query(
                    `SELECT 
                        id,
                        usuario_id, 
                        nombre, 
                        artista, 
                        whatsapp, 
                        facebook,
                        tiktok,
                        instagram,
                        vimeo,
                        youtube,
                        image
                        FROM datos_usuario
                        WHERE usuario_id = ?`,
                    [usuario_id]  // Corregir la consulta para obtener los datos de un usuario por su usuario_id
                );
                res.status(200).json(rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }

        if (id) {
            try {
                const [rows] = await connection.query(
                    'SELECT id, usuario_id, nombre, artista, whatsapp, facebook, tiktok, instagram, vimeo, youtube, image FROM datos_usuario WHERE id = ?',
                    [id]  // Usamos el ID de la entrada
                );
                res.status(200).json(rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            try {
                const [rows] = await connection.query(
                    `SELECT 
                        id,
                        usuario_id, 
                        nombre, 
                        artista, 
                        whatsapp, 
                        facebook,
                        tiktok,
                        instagram,
                        vimeo,
                        youtube,
                        image
                        FROM datos_usuario`
                );
                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    } else if (req.method === 'POST') {
        // Crear un nuevo usuario
        const { usuario_id, nombre, artista, whatsapp, facebook, tiktok, instagram, vimeo, youtube } = req.body;

        try {
            const [result] = await connection.query(
                `INSERT INTO datos_usuario (usuario_id, nombre, artista, whatsapp, facebook, tiktok, instagram, vimeo, youtube)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [usuario_id, nombre, artista, whatsapp, facebook, tiktok, instagram, vimeo, youtube]
            );

            res.status(201).json({ id: result.insertId, usuario_id, nombre, artista, whatsapp, facebook, tiktok, instagram, vimeo, youtube });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {
        // Actualizar un usuario existente
        const { usuario_id, nombre, artista, whatsapp, facebook, tiktok, instagram, vimeo, youtube } = req.body;

        if (!usuario_id) {
            return res.status(400).json({ error: 'ID del usuario es necesario para actualizar' });
        }

        try {
            const [result] = await connection.query(
                `UPDATE datos_usuario 
                 SET nombre = ?, artista = ?, whatsapp = ?, facebook = ?, tiktok = ?, instagram = ?, vimeo = ?, youtube = ?
                 WHERE usuario_id = ?`,  // Usamos el usuario_id para actualizar
                [nombre, artista, whatsapp, facebook, tiktok, instagram, vimeo, youtube, usuario_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json({ usuario_id, nombre, artista, whatsapp, facebook, tiktok, instagram, vimeo, youtube });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
