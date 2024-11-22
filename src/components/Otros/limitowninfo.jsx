import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { color } from 'chart.js/helpers';

const LumitowPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const sections = [
    {
      title: "Explore Lumiterra like never before with Lumitow!",
      content: "Get ready to immerse yourself in a unique experience! Lumitow, the new platform created by Townlabs, opens the doors to all the secrets and strategies of the vast world of Lumiterra. If you’ve ever dreamed of a guide that brings together all the mysteries of the game, your dream has just come true! Lumitow is not just a website; it’s your adventure companion, designed to help you succeed, improve, and explore every corner of the game. Here begins your path to greatness!",
      image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730951083/Lumitown_jnx13i.webp' // Imagen específica por sección
    },
    {
      title: "Intuitive and Visually Stunning Design",
      content: "In addition to being the most comprehensive source of information about Lumiterra, Lumitow is designed to provide you with a visually striking and easy-to-use experience. Every element is crafted so you can find what you need in seconds, navigating an intuitive site that makes your exploration and learning hassle-free. You’ll love getting lost in this interface while discovering everything Lumitow has to offer!",
      image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730952882/image_cmezmc.webp' // Imagen específica por sección
    },
    {
      title: "Beginner’s Guide",
      content: "For new adventurers about to embark on this epic journey, we’ve prepared a Beginner’s Guide that will give you the edge you need from the very first minute. You’ll learn how to move, leverage your resources, and understand the combat and crafting systems like an expert. Lumitow prepares you to not just survive but to stand out from day one!",
      image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730948391/GbdwJV0bIAAUf_s_e0xuin.webp' // Imagen específica por sección
    },
    {
      title: "Wiki",
      content: "Welcome to the most complete knowledge base of Lumiterra. The Lumitow Wiki gives you access to the ultimate arsenal to conquer the game: Complete crafting system: Want to create the best items and build the ultimate inventory? Here, you’ll find all the recipes and craftable items, divided into the three essential branches of the game: Combat, Agriculture, and Gathering. Each recipe allows you to explore new strategies and achieve mastery in each area. With Lumitow, you can build an empire!",
      image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730764891/marketimage_ob7dkd.webp' // Imagen específica por sección
    },
    {
      title: "Missions and Dungeons",
      content: "Dare to explore the mission and dungeon guides, with insights never before seen on each challenge and reward in Lumiterra. Uncover hidden secrets, unlock strategies from the most experienced players, and conquer each dungeon with confidence. With this guide, triumph is guaranteed!",
      image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730951912/cover-1_3x_1_f4twx7.webp' // Imagen específica por sección
    },
    {
      title: "Monster Diary",
      content: "Want to dominate every encounter? Lumitow provides you with the ultimate monster diary. Know the weak points, abilities, and locations of every creature in the game. Be the hunter instead of the prey and prepare to become a legend!",
      image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730952099/asd_vzvrn4.webp' // Imagen específica por sección
    },
    {
      title: "Market",
      content: "The Lumiterra Market will hold no secrets for you. With real-time access to Mavis Market, you’ll be able to buy and sell with precision, using advanced filters that let you search by price, tier, and game branch. Want to be the craftiest trader? With Lumitow, you’ll always find the best opportunity to increase your wealth and resources. Nothing will slip by you!",
      image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730952259/tools_nktnm0.webp' // Imagen específica por sección
    },
    {
      title: "Interactive Map",
      content: "Our Interactive Map is a unique tool that will make exploring Lumiterra an experience like no other: Important NPCs: Find every key character in seconds. You’ll never waste time searching for your next mission step again. Bosses and Monsters: Get ready for the most intense encounters with the exact locations of bosses and monsters. Plan your attacks and show that you’re a true champion. Dungeons, Missions, and PvP Zones: Every area of Lumiterra is at your fingertips. From the most feared dungeons to mission areas and PvP combat zones. Never before has exploring Lumiterra been so exciting and effective. With Lumitow, nothing will hold you back!",
      image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730952384/2nd_test_u9gm5k.webp' // Imagen específica por sección
    },
    {
      title: "News from Lumiterra and the Latest in Web3",
      content: "At Lumitow, we’ll also keep you updated on the latest news from Lumiterra, with updates on events, improvements, and expansions you need to know to stay at the forefront. Additionally, we’ll delve into the world of Web3, covering the most relevant news in the industry, especially related to the Ronin network, so you’ll always be informed about the most important innovations. From technological developments to market changes and investment opportunities, Lumitow will be your window to the future of gaming and blockchain technology!",
      image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730952495/noticias-de-C3BAltima-hora-palabra-estilo-cC3B3mico_vsclis.webp' // Imagen específica por sección
    },
    {
      title: "Are you ready to become a legend in Lumiterra?",
      content: "Lumitow is not just a guide; it’s the key that will unlock your true potential in the game. With its intuitive, visually stunning, and user-friendly design, Lumitow transforms every moment into an epic experience. Start now and get ready to face every challenge, every adventure, and every triumph like a true master of Lumiterra! Your epic journey begins here, at Lumitow!",
      image: 'https://res.cloudinary.com/dm94dpmzy/image/upload/v1730952596/Totem2_gx0e2q.webp' // Imagen específica por sección
    }
  ];

  useEffect(() => {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#00001c'
    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);

  return (
    <Container maxWidth="lg" style={styles.container}>
        <img 
        src="https://res.cloudinary.com/dm94dpmzy/image/upload/v1730955302/LumiTown_Logo_vector-export_ubpqyk.webp" 
        alt="Lumitow Logo" 
        style={styles.logo} 
      />
      {sections.map((section, index) => (
        <Paper 
          key={index} 
          style={{
            ...styles.section,
            transform: hoveredIndex === index ? 'translateY(-2px)' : 'none',
            boxShadow: hoveredIndex === index ? '0 15px 30px rgba(0, 0, 0, 0.4)' : '0 10px 20px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Grid container spacing={2}>
            {index % 2 === 0 ? ( // Even index: image on the left
              <>
                <Grid item xs={12} md={4}>
                  <img src={section.image} alt={section.title} style={styles.image} />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography 
                    variant="h5" 
                    style={{
                      ...styles.sectionTitle,
                      fontWeight: hoveredIndex === index ? 'bold' : 'normal',
                      fontSize: hoveredIndex === index ? '1.125rem' : '1rem',
                    }}
                  >
                    {section.title.toLocaleUpperCase()}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    style={{
                      ...styles.content,
                      fontWeight: hoveredIndex === index ? 'bold' : 'normal',
                      fontSize: hoveredIndex === index ? '1.025rem' : '1rem',
                    }}
                  >
                    {section.content}
                  </Typography>
                </Grid>
              </>
            ) : ( // Odd index: image on the right
              <>
                <Grid item xs={12} md={8}>
                  <Typography 
                    variant="h5" 
                    style={{
                      ...styles.sectionTitle,
                      fontWeight: hoveredIndex === index ? 'bold' : 'normal',
                      fontSize: hoveredIndex === index ? '1.125rem' : '1rem',
                    }}
                  >
                    {section.title.toLocaleUpperCase()}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    style={{
                      ...styles.content,
                      fontWeight: hoveredIndex === index ? 'bold' : 'normal',
                      fontSize: hoveredIndex === index ? '1.025rem' : '1rem',
                    }}
                  >
                    {section.content}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <img src={section.image} alt={section.title} style={styles.image} />
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      ))}
    </Container>
  );
};

const styles = {
  container:{
    fontFamily: 'Comic Sans MS',
  },
  title: {
    marginBottom: '40px'
  },
  section: {
    padding: '20px',
    marginBottom: '20px',
    background: '#10305e',
    borderRadius: '8px',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  logo: {
    display: 'block',
    margin: '40px auto',
    width: 'auto',
    maxWidth: '300px',
  },
  image: {
    width: '100%', 
    height: 'auto',
    borderRadius: '8px', 
    objectFit: 'cover', 
  },
  sectionTitle: {
    color: 'white',
    fontFamily: 'Comic Sans MS',
    marginBottom: '10px',
    transition: 'font-size 0.3s, font-weight 0.3s',
  },
  content: {
    color: 'white',
    fontFamily: 'Comic Sans MS',
    lineHeight: '1.6',
    transition: 'font-size 0.3s, font-weight 0.3s',
  },
};

export default LumitowPage;
