const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { kebabCase } = require("lodash");

// mostro tutti i post in rotta index 
async function index(req, res) {
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
        const posts = await prisma.post.findMany({
            where: filter,
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
    try {
        const insertData = req.body;
        const baseSlug = kebabCase(insertData.title);
        const uniqueSlug = await generateUniqueSlug(baseSlug);

        const newPost = await prisma.post.create({
            data: {
                title: insertData.title,
                slug: uniqueSlug,
                image: insertData.image,
                content: insertData.content,
                published: insertData.published,
            },
        });

        return res.json(newPost);
    } catch (error) {
        console.error("Error during database insertion:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
//mostro un singolo elemento tramite slug  con show
async function show(req, res) {
    const dbSlug = req.params.slug;
    console.log(dbSlug);
    const data = await prisma.post.findUnique({
        where: {
            slug: dbSlug,
        }
    });
    if (!data) {
        return res.status(404).json({ error: "Elemento non trovato" });
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