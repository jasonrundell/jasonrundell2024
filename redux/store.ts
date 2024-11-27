import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './characterSlice';

export const store = configureStore({
  reducer: {
    character: characterReducer,
  },
});

export const characters = [
  {
    id: '1',
    image: '/characters/aria-synthwave-kepler/aria-synthwave-kepler.png',
    name: 'Aria "Synthwave" Kepler',
    visualDescription:
      'Aria stands at 5\'9" with an athletic build, her body enhanced with sleek, chrome cybernetics that reflect the neon lights of the city. Her hair is a luminescent blue, cascading down in waves, and her eyes are a striking violet, with digital readouts flickering across the irises. She wears a high-tech bodysuit that integrates various gadgets and weapons, and her left arm is a fully robotic limb with a built-in holographic interface.',
    bio:
      'Aria Kepler, known by her alias "Synthwave," is a top-tier hacker and mercenary in the sprawling metropolis of Neo-Tokyo. Born in the slums, she fought her way up the ranks of the city\'s underworld using her unparalleled tech skills and street smarts. Her mission is to uncover the secrets of the megacorporations that control the city and bring justice to those they oppress. Aria is known for her quick wit, loyalty to her allies, and her unyielding determination to expose the truth.',
    quotes: [
      '"In a world full of shadows, it\'s the neon that lights the way."',
      '"I\'ve got more tricks up my sleeve than the megacorps have secrets."',
      '"Trust is earned in bytes and blood on these streets."',
      '"You mess with the system, you mess with me."',
    ],
  },
  {
    id: '2',
    image: '/characters/darius-nightshade/darius-nightshade.png',
    name: 'Darius Nightshade',
    visualDescription:
      'Darius Nightshade is an imposing figure with a commanding presence. Standing at 6\'2", he has a broad, muscular build that speaks of his vampire lineage. His short, dark brown hair is always impeccably styled, contrasting with his olive skin and deep, crimson eyes that glow with a predatory intensity. He wears a tailored black suit with a high-collared, crimson shirt, accented with a silver chain and a family crest pendant. His look is completed with a pair of black leather gloves and a long, flowing coat that billows dramatically as he moves.',
    bio:
      'Darius Nightshade hails from an ancient and noble vampire clan known for their power and ruthlessness. He has lived for centuries, honing his skills in combat and politics, making him a feared and respected leader. Despite his fearsome reputation, Darius harbors a hidden sorrow from a lost love, driving his quest for power as a means to fill the void. He has a complicated relationship with the werewolves, seeing them as both adversaries and necessary allies in maintaining the delicate balance of the supernatural world.',
    quotes: [
      '"Power is the currency of our world; without it, you are nothing but prey."',
      '"Every alliance comes with a price. Are you willing to pay it?"',
      '"The night is long and full of terrors; only the strong can claim dominion over it."',
      '"In immortality, one must find purpose, or risk being consumed by the darkness."',
    ],
  },
  {
    id: '3',
    image: '/characters/jax-voidwalker/jax-voidwalker.png',
    name: 'Jax Voidwalker',
    visualDescription:
      'Jax Voidwalker is a towering figure, standing at 6\'5" with a broad, muscular build. He has short, spiky silver hair and one glowing blue cybernetic eye, while the other eye is a natural, intense gray. His skin is tanned, and his face is marked by a deep scar running from his left eyebrow to his jawline. Jax wears a rugged, armored trench coat with multiple pockets and holsters, hinting at his well-armed nature. His right arm is a bulky cybernetic limb, equipped with various hidden weapons and gadgets. The coat is adorned with glowing blue circuitry, matching the hue of his cybernetic eye.',
    bio:
      "Jax Voidwalker is a former soldier turned bounty hunter in the chaotic megacity of Dystopolis. Once a loyal enforcer for a powerful corporation, Jax turned rogue after discovering the company's dark secrets. Now, he works for the highest bidder, using his combat skills and advanced tech to track down targets across the city. Despite his rough exterior, Jax follows a personal code of honor, often taking on jobs to protect the innocent or bring justice to the corrupt. Haunted by his past but driven by a sense of duty, he walks the line between vigilante and mercenary.",
    quotes: [
      'In the void, there’s no room for doubt—only action.',
      'Every scar tells a story, and mine are written in blood and steel.',
      'Loyalty is earned, not bought, and trust is a rare currency.',
      'I don’t start fights, but I sure as hell finish them.',
    ],
  },
  {
    id: '4',
    image: '/characters/lila-nexus/lila-nexus.png',
    name: 'Lila Nexus',
    visualDescription:
      'Lila Nexus is a slender, agile figure, standing at 5\'6" with a graceful yet strong build. She has long, flowing violet hair that shimmers with metallic hues, styled in loose waves. Her eyes are a striking, luminous silver, reflecting her enhanced vision capabilities. Lila wears a sleek, form-fitting suit made of flexible, high-tech material that adapts to her movements. The suit is adorned with intricate, glowing patterns in shades of purple and blue, which pulse gently as she moves. She has a pair of advanced cybernetic gauntlets on her arms, equipped with various tools and weapons for both offense and defense.',
    bio:
      'Lila Nexus was once a brilliant scientist working on cutting-edge cybernetic enhancements for a powerful corporation. After a failed experiment that nearly cost her life, she fled the company, taking her research with her. Now, she operates as a freelance tech specialist and hacker, using her knowledge and abilities to assist those in need and to sabotage the very corporations that seek to control the world. Driven by a desire for redemption and a sense of justice, Lila navigates the dark alleys and neon-lit skyscrapers of Techno City, always staying one step ahead of those who hunt her.',
    quotes: [
      'Knowledge is power, and I wield it like a weapon.',
      'Every system has a weakness; you just need to know where to look.',
      "The future is not written in code—it's hacked and rewritten.",
      'In the digital world, I am the ghost in the machine.',
    ],
  },
  {
    id: '5',
    image: '/characters/lysandra-blackthorn/lysandra-blackthorn.png',
    name: 'Lysandra Blackthorn',
    visualDescription:
      "Lysandra Blackthorn is a striking figure with an ethereal beauty that borders on the supernatural. She stands at 5'8\", with a lean, athletic build that hints at her werewolf heritage. Her long, raven-black hair cascades down her back in loose waves, contrasting sharply with her pale, almost luminescent skin. Her eyes, a piercing shade of silver, seem to see right through to one's soul, reflecting both wisdom and a deep, unyielding strength. She often wears dark, form-fitting clothing that allows for easy movement, accessorized with silver jewelry etched with ancient runes.",
    bio:
      'Lysandra Blackthorn is a rare hybrid, born of a powerful werewolf father and a vampire mother, making her an outcast in both worlds. She has spent her life navigating the treacherous politics of the supernatural world, earning respect and fear from those who underestimate her. With heightened senses and unparalleled agility, Lysandra has become a formidable hunter, seeking to protect the fragile peace between werewolves and vampires. Despite her tough exterior, she harbors a deep sense of loyalty and a desire to belong, often finding solace in the moonlit forests where she feels most at home.',
    quotes: [
      'In a world where shadows rule, one must become the darkness to find the light.',
      'Trust is a luxury we can rarely afford, yet it is the key to our survival.',
      "I've faced monsters within and without; only those who embrace their duality can truly conquer.",
      'The night whispers secrets to those who dare to listen. Are you ready to hear them?',
    ],
  },
  {
    id: '6',
    image: '/characters/nyx-solara/nyx-solara.png',
    name: 'Nyx Solara',
    visualDescription:
      'Nyx Solara is a petite but formidable figure, standing at 5\'4" with a toned, agile build. Her hair is a cascade of fiery red, styled into a wild, asymmetrical cut that frames her face. She has piercing green eyes that seem to glow with an inner light, hinting at some hidden power. Nyx wears a sleek, black bodysuit reinforced with lightweight armor plates, ideal for quick movements and stealth. Her attire is accented with luminescent green lines that trace her silhouette, pulsing softly in rhythm with her heart. Her right arm is a mechanical marvel, a sleek prosthetic with built-in tools and weaponry.',
    bio:
      'Nyx Solara grew up in the underbelly of the sprawling megacity of Neon Haven, learning to fend for herself from a young age. An orphan with a mysterious past, she discovered her latent abilities in manipulating energy, making her a target for various factions. Choosing the path of a mercenary, Nyx now operates as a freelance agent, using her unique skills and combat training to take on high-risk missions. Though she maintains a tough exterior, she is driven by a desire to uncover the truth about her origins and the strange powers she possesses.',
    quotes: [
      'In the darkness, I am the spark that ignites change.',
      "You can't outrun your past, but you can outsmart it.",
      'Every mission is a step closer to finding who I really am.',
      "Energy is everywhere; it's up to me to harness it.",
    ],
  },
  {
    id: '7',
    image: '/characters/orion-blade/orion-blade.png',
    name: 'Orion Blade',
    visualDescription:
      'Orion Blade is a rugged, imposing figure, standing at 6\'3" with a muscular build. His hair is a deep black, shaved on the sides with a long, braided mohawk running down the center. He has piercing blue eyes that seem to glow with an inner intensity. His face is adorned with tribal tattoos that give him a fierce and intimidating look. Orion wears a heavily armored vest over a dark, sleeveless shirt, revealing his tattooed arms. His attire is completed with combat pants and heavy boots, along with a utility belt filled with various gadgets. His left leg is a cybernetic prosthetic, sleek and powerful, designed for combat and endurance.',
    bio:
      "Orion Blade was born into a clan of warriors in the lawless outskirts of the megacity of Nexus Prime. Trained in the arts of combat from a young age, he rose through the ranks to become the clan's fiercest protector. However, after a devastating attack on his clan by a rival faction backed by a powerful corporation, Orion was left for dead and barely survived, thanks to advanced cybernetic enhancements. Now, he roams the city as a lone vigilante, seeking vengeance for his fallen clan and fighting against the corporate oppression that plagues Nexus Prime. With his unparalleled combat skills and unbreakable spirit, Orion takes on any challenge that comes his way.",
    quotes: [
      'Strength is not just in the body, but in the will to fight.',
      'In a world of shadows, be the blade that cuts through the darkness.',
      'Vengeance is my path, and justice is my destination.',
      'The scars of the past fuel the fire of my resolve.',
    ],
  },
  {
    id: '8',
    image: '/characters/vex-morgan/vex-morgan.png',
    name: 'Vex Morgan',
    visualDescription:
      "Vex Morgan is a tall, lean figure, standing at 6'2\" with a wiry build that speaks of agility rather than brute strength. He has jet-black hair styled into a sleek undercut with neon blue tips that glow faintly in the dark. His eyes are cybernetic implants, a striking deep red with a digital interface visible when he accesses information. Vex's skin is a light olive tone, marred with a few scars from past skirmishes. He wears a high-collared leather jacket, embedded with glowing circuitry that pulses in sync with his heartbeat. His attire is completed with a pair of worn combat boots, and his left arm is a sophisticated cybernetic prosthetic adorned with intricate engravings.",
    bio:
      'Vex Morgan, once a top-tier hacker for a notorious underground syndicate, now operates as a rogue agent in the sprawling megacity of Neo-Tokyo. Betrayed by his own for refusing to compromise his principles, Vex now dedicates his skills to undermining the corrupt corporations that rule the city. Living in the shadows, he uses his exceptional hacking abilities and combat prowess to fight for the oppressed and expose the dark secrets of the elite. Haunted by his past but driven by a desire for justice, Vex navigates the neon-lit streets, always one step ahead of those who seek to silence him.',
    quotes: [
      'In a world where data is power, my mind is my weapon.',
      'Trust no one, especially those who claim to be allies.',
      'The code is law, and I am its enforcer.',
      'Beneath the neon lights, the truth hides in plain sight.',
    ],
  }
];
