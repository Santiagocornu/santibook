# Santibook

> 🐦 Red social full-stack con React + Firebase Auth + Mongo Atlas. Permite a los usuarios registrarse, publicar contenido, interactuar con otros y enviar mensajes privados.
(servidor y front hecho con herramientas gratis. cuando se obtienen los mensajes nuevos es por polling y no por un webhook gracias a carecer de fondos para hostear un server con webhooks.)

## 📌 Funcionalidades principales

### Usuarios
- **addUser.js**: agrega un nuevo usuario.  
- **getUser.js / getUserByUid.js**: obtener información de un usuario.  
- **editUser.js**: editar datos del usuario.  
- **deleteUser.js**: eliminar un usuario.  
- **toggleFollower.js**: seguir o dejar de seguir a un usuario.

### Posts
- **addPost.js**: crear un nuevo post.  
- **getPosts.js / getPostsByUid.js**: obtener todos los posts o por usuario.  
- **editPost.js**: editar un post existente.  
- **deletePost.js**: eliminar un post.  
- **updatePostLikes.js**: actualizar los likes de un post.  
- **comentPost.js**: comentar un post.

### Mensajes / Chat
- **createChat.js**: iniciar un chat entre usuarios.  
- **getChatById.js / getChatByUid.js**: obtener un chat específico.  
- **addMessage.js**: agregar un mensaje a un chat.  
- **getMessages.js**: listar los mensajes de un chat.  
- **checkNewMessages.js**: verificar si hay mensajes nuevos.

### Tests
- **test.js**: archivo para probar funciones o endpoints.

---

## 🧰 Tecnologías usadas
- Front-end: React.js  
- Back-end: Node.js / Express  
- Base de datos: MongoDB / Mongo Atlas  
- Autenticación: Firebase Auth  
- JavaScript ES6+  

---

## 🚀 Cómo correr el proyecto localmente
1. Clonar el repo:
```bash
git clone https://github.com/Santiagocornu/santibook.git
cd santibook
Instalar dependencias:

bash
Copiar código
npm install
Configurar credenciales de Firebase y Mongo Atlas.

Levantar el servidor:

bash
Copiar código
npm start
Abrir en tu navegador: http://localhost:3000
