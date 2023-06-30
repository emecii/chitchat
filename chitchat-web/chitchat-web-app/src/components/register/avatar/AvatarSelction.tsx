import React from 'react';

interface AvatarSelectionProps {
  selectedAvatar?: string;
  onSelectAvatar: (avatarUrl: string) => void;
}

const AvatarSelection: React.FC<AvatarSelectionProps> = ({
  selectedAvatar,
  onSelectAvatar
}) => {
  const avatarImages = [
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltf9011394eb293887/609ae4498c053e542a586626/WRRainbowPoro_512.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blteaea78d78c758d38/609ae4527ee89a47ff53a861/WRTanzanitePoro_512.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltb39be2b65a125cf7/609ae45e4adba359327cd246/WRCatseyePoro_512.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt110633b028c0229f/609ae46643430a55689b294f/WRCitrinePoro_512.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt1941a709e8a4a20f/609ae4787ee89a47ff53a865/WRObsidianPoro_512.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blta2b422dcddd5568b/609ae47fcf14c84a993e036e/WRRoseQuartzPoro_512.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt120105349c8e60d4/609ae487ea72f24924be0b05/WRSapphirePoro_512.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt64b0b0b50b3874b6/6099c9ac43430a55689b2260/ACE_PRIDE.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltc9a64ec13d09c6bb/6099c9b83705f74a9ffbd894/BI_PRIDE.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blta538de37506d7105/6099c9cace885c5a4f282225/GAY_PRIDE.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt57eb4085a1156f20/6099c9d943430a55689b2264/LESBIAN_PRIDE.jpg',
    'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt99261427ba8d249a/6099c9ee01ff5a556925c9ce/NONBINARY_PRIDE.jpg'
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {avatarImages.map((avatarUrl, index) => (
          <img
            key={index}
            src={avatarUrl}
            alt={`Avatar ${index + 1}`}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '50%',
              cursor: 'pointer',
              border: selectedAvatar === avatarUrl ? '2px solid blue' : 'none'
            }}
            onClick={() => onSelectAvatar(avatarUrl)}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarSelection;
