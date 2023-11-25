const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { kebabCase } = require("lodash");
const { validationResult } = require('express-validator');

// mostro tutti i post in rotta index 
async function index(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { published, content } = req.query;


        const filter = {};
        if (published) {
            filter.published = published.toLowerCase() === 'true';
        }
        if (content) {
            filter.OR = [
                { title: { contains: content.toLowerCase() } },
                { content: { contains: content.toLowerCase() } },
            ];
        }
        console.log('Filter:', filter);
        const posts = await prisma.post.findMany({
            where: filter,
            include: {
                tags: true,
                category: true
            }
        });

        res.json(posts);
    } catch (error) {
        console.error("Errore durante il recupero dei post:", error);
        res.status(500).json({ error: "Errore interno del server" });

    }
}



//per inserire nel db
//se lo slug esiste
async function isSlugExists(slug) {
    const existingPost = await prisma.post.findUnique({
        where: {
            slug: slug,
        },
    });

    return existingPost !== null;
}
//genera uno slug univoco con counter vicino se già presente 
async function generateUniqueSlug(baseSlug) {
    let slug = baseSlug;
    let counter = 1;

    while (await isSlugExists(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}



async function store(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const insertData = req.body;
    const baseSlug = kebabCase(insertData.title);
    const categotySlug = kebabCase(insertData.name);
    const uniqueCategorySlug = await generateUniqueSlug(categotySlug);
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    const newPost = await prisma.post.create({
        data: {
            title: insertData.title,
            slug: uniqueSlug,
            image: insertData.image,
            content: insertData.content,
            published: insertData.published,
            category: {
                create: {
                    name: insertData.name,
                    slug: uniqueCategorySlug
                }
            },
            tags: {
                create: {
                    titleT: insertData.titleT
                }
            },
        },
        include: {
            category: true,
            tags: true
        },
    });

    return res.json(newPost);

}
//mostro un singolo elemento tramite slug  con show
async function show(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const dbSlug = req.params.slug;
    console.log(dbSlug);
    const data = await prisma.post.findUnique({
        where: {
            slug: dbSlug,
        }
    });
    if (!data) {
        // Se non viene trovato uno slug corrispondente, restituisci il messaggio personalizzato
        return res.status(404).json({ error: 'L\'elemento da te cercato non esiste' });
    }
    return res.json(data);
}

//funzione per modifica 
async function update(req, res) {
    const dbSlug = req.params.slug;
    const updateData = req.body;
    console.log(dbSlug);
    if (updateData.title) {
        const baseSlug = kebabCase(updateData.title);
        const uniqueSlug = await generateUniqueSlug(baseSlug);
        updateData.slug = uniqueSlug;
    }
    const post = await prisma.post.findUnique({
        where: {
            slug: dbSlug,
        },
    });
    if (!post) {
        throw new Error('Not found');
    }

    const updatePost = await prisma.post.update({
        data: updateData,
        where: {
            slug: dbSlug,
        },
    })
    res.json(updatePost);
}

//funzione per eliminare
async function destroy(req, res) {
    const dbSlug = req.params.slug;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log("Errori di validazione:", errors.array());
    const postToDelete = await prisma.post.findUnique({
        where: {
            slug: dbSlug,
        },
    });
    if (!postToDelete) {
        return res.status(404).json({ error: "Il post non esiste" });
    }
    await prisma.post.delete({
        where: {
            slug: dbSlug,
        },
    });

    return res.json({ message: "Post eliminato" });
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy

}