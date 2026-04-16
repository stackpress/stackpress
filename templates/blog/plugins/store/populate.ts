//modules
import type { UnknownNest } from '@stackpress/lib/types';
import { control } from '@stackpress/lib/Terminal';
//stackpress
import type { ProfileAuth } from 'stackpress';
import { action } from 'stackpress/server';

const secret = process.env.ADMIN_PASS || 'admin';

const controls = control('[BLOG]')

export default action.props(async function Populate({ ctx }) {
  controls.system('Populating database with example data...');
  const admin = await ctx.resolve<ProfileAuth>('auth-signup', {
    type: 'person',
    name: 'John Doe',
    username: 'admin',
    email: 'admin@project.com',
    secret: secret,
    roles: [ 'ADMIN' ]
  });
  const anime = await ctx.resolve<UnknownNest>('category-create', {
    banner: 'https://i.pinimg.com/736x/86/e3/34/86e3344c625be5db137c16d6d06e5ad3.jpg',
    slug: 'anime',
    name: 'Anime',
    description: 'All about anime'
  });
  const gaming = await ctx.resolve<UnknownNest>('category-create', {
    banner: 'https://wallpapers.com/images/hd/youtube-banner-gaming-63ft5u6qosotxyaj.jpg',
    slug: 'gaming',
    name: 'Gaming',
    description: 'All about gaming'
  });
  const pokemon = await ctx.resolve<UnknownNest>('article-create', {
    profileId: admin.results?.id,
    banner: 'https://g.foolcdn.com/editorial/images/598665/pokemon-go.jpg',
    slug: 'pokemon-turns-30-how-the-fictional-pocket-monsters-shaped-science',
    title: 'Pokémon turns 30 — how the fictional pocket monsters shaped science',
    contents: `<p>On 27 February 1996, Japanese game designer Satoshi Tajiri 
    released the first ever Pokémon games for the Nintendo Game Boy. What 
    started as a childhood passion for collecting insects grew into a giant 
    franchise and global phenomenon with themes of science at its heart.</p>
    <p>The fictional world of Pokémon has found its way into science and 
    academic research, including ecology, fossils, evolution, biodiversity, 
    education and even calling out predatory journals.</p>
    <p>“It influenced my idea of what animals and natural history were, 
    almost before I knew what real animals in the real world were like,” 
    says Arjan Mann, assistant curator of fossil fishes and early tetrapods 
    at the Field Museum in Chicago, Illinois, who was a child when the 
    television series came out.</p>`,
    keywords: [ 'pokemon', 'nintendo' ],
    tags: [ 'Satoshi Tajiri', 'Arjan Mann' ],
    references: { source: 'nature.com' },
    status: 'PUBLISHED',
    published: new Date('2024-02-27T12:00:00Z')
  });
  const minecraft = await ctx.resolve<UnknownNest>('article-create', {
    profileId: admin.results?.id,
    banner: 'https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/MSpotlight_HEADER.jpg',
    slug: 'minecraft-is-15-years-old-and-still-changing-lives',
    title: 'Minecraft is 15 years old and still changing lives',
    contents: `<p>A few days ago, I was tidying my home office – which more 
    closely resembles a video game arcade recently hit by a tornado – when I 
    found a long-lost piece of technology in the bottom drawer of my filing 
    cabinet. It was an old Xbox 360, the Elite model – black, heavy, ungainly, 
    impossibly retro. Out of curiosity, I hauled it out, found a controller 
    and power cable and switched it on. I knew immediately what I wanted to 
    look for, but I was also apprehensive: I didn’t know how I’d feel if 
    Minecraft was still there – or worse, if it wasn’t. Minecraft, you see, 
    is more than just a game for me. I thought about just putting the console 
    back where I found it. But as this month sees the 15th anniversary of the 
    game’s original release, I felt I had to go on.</p>
    <p>In 2012, Microsoft held a big Xbox Games Showcase event at a cavernous 
    venue in San Francisco. The company was showing all the biggest titles of 
    the era – Forza, Gears of War, Halo – but in one quiet corner sat a couple 
    of demo units showing off the as yet unreleased Xbox version of Minecraft. 
    I already knew about the game, of course – designed by Swedish studio Mojang, 
    it was an open-world creative adventure, allowing players to explore vast, 
    procedurally generated worlds, collect resources and build whatever they 
    wanted. It was already attracting millions of players on PC. But I had 
    never really given it much time; so I sat down to have a quick go … and 
    ended up staying for an hour. There was something in it that was holding me 
    there, despite all the other games on offer. That something was Zac.</p>`,
    keywords: [ 'xbox', 'pc' ],
    references: { source: 'minecraft.net' },
    tags: [ 'Mojang', 'Microsoft' ],
    status: 'PUBLISHED',
    published: new Date('2024-11-15T12:00:00Z')
  });
  await ctx.resolve('catalog-create', {
    categoryId: anime.results?.id,
    articleId: pokemon.results?.id
  });
  await ctx.resolve('catalog-create', {
    categoryId: gaming.results?.id,
    articleId: minecraft.results?.id
  });
  await ctx.resolve('comment-create', {
    profileId: admin.results?.id,
    articleId: pokemon.results?.id,
    comment: 'Great article!'
  });
  await ctx.resolve('comment-create', {
    profileId: admin.results?.id,
    articleId: pokemon.results?.id,
    comment: 'Congrats on 30 years of Pokémon!'
  });
  await ctx.resolve('comment-create', {
    profileId: admin.results?.id,
    articleId: minecraft.results?.id,
    comment: 'Minecraft is still amazing after 15 years!'

  });
  await ctx.resolve('comment-create', {
    profileId: admin.results?.id,
    articleId: minecraft.results?.id,
    comment: 'Looking forward to the next 15 years of Minecraft!'
  });
  await ctx.resolve('application-create', {
    profileId: admin.results?.id,
    name: 'Example App',
    scopes: [ 'profile-write', 'auth-read' ],
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  });
  controls.success('Database population complete!');
});