export const petsData = {
  dogs: [
    {
      petId: 1,
      name: "Buddy",
      age: "3 years",
      location: "Andheri",
      weight: "25 kg",
      breed: "Golden Retriever",
      gender: "Male",
      description: "Buddy is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks.",
      traits: [
        { text: "Not Spayed", status: "warning" },
        { text: "Shots Up to Date", status: "success" },
        { text: "Needs Loving Adopter", status: "success" },
        { text: "Good with Cats", status: "success" },
        { text: "Good with Dogs", status: "success" },
        { text: "Good with Kids", status: "success" }
      ],
      characteristics: ["Friendly", "Playful", "Trained", "Healthy"],
      images: ["https://i.pinimg.com/736x/0f/df/f2/0fdff247f04db35ff15f326a1f96a59f.jpg",
         "https://i.pinimg.com/enabled_lo/564x/8d/5c/a4/8d5ca46716f7529f3f2a69de76558078.jpg",
          "https://i.pinimg.com/enabled_lo/236x/b4/78/72/b47872c3b6f33cecbf2cae3ef967f2cc.jpg",
          "https://i.pinimg.com/enabled_lo/236x/a9/f9/05/a9f9055c44977e6cc303a2df3657a117.jpg",
           "https://i.pinimg.com/enabled_lo/236x/23/b6/d3/23b6d35cd6b97c9e400f534a3f7df648.jpg"]
    },
    {
      petId: 2,
      name: "Max",
      age: "2 years",
      location: "Bandra",
      weight: "30 kg",
      breed: "German Shepherd",
      gender: "Male",
      description: "Max is a well-trained German Shepherd with a protective nature and loving personality.",
      traits: [
        { text: "Neutered", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "House Trained", status: "success" },
        { text: "Good with Dogs", status: "warning" },
        { text: "Good with Kids", status: "success" },
        { text: "Needs Exercise", status: "warning" }
      ],
      characteristics: ["Protective", "Intelligent", "Active", "Loyal"],
      images: ["https://i.pinimg.com/564x/54/75/0f/54750f834d90183160f1fc662ae42359.jpg",
         "https://i.pinimg.com/enabled_lo/564x/0c/f0/fb/0cf0fb24b1f1448bfe45512290c875a1.jpg",
          "https://i.pinimg.com/enabled_lo/564x/0c/f0/fb/0cf0fb24b1f1448bfe45512290c875a1.jpg",
           "https://i.pinimg.com/enabled_lo/564x/0c/f0/fb/0cf0fb24b1f1448bfe45512290c875a1.jpg",
            "https://i.pinimg.com/564x/c7/93/ae/c793ae372886c450d55535211231204e.jpg"]
    },
    {
      petId: 3,
      name: "Luna",
      age: "1 year",
      location: "Juhu",
      weight: "15 kg",
      breed: "Labrador",
      gender: "Female",
      description: "Luna is a young, energetic Labrador puppy who loves water and playing with toys.",
      traits: [
        { text: "Not Spayed", status: "warning" },
        { text: "Shots Up to Date", status: "success" },
        { text: "Training Needed", status: "warning" },
        { text: "Good with Cats", status: "success" },
        { text: "Good with Dogs", status: "success" },
        { text: "Good with Kids", status: "success" }
      ],
      characteristics: ["Energetic", "Playful", "Loving", "Social"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    {
      petId: 4,
      name: "Rocky",
      age: "5 years",
      location: "Powai",
      weight: "28 kg",
      breed: "Husky",
      gender: "Male",
      description: "Rocky is a majestic Husky with striking blue eyes and a gentle temperament.",
      traits: [
        { text: "Neutered", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "Needs Space", status: "warning" },
        { text: "Good with Dogs", status: "success" },
        { text: "High Energy", status: "warning" },
        { text: "Experienced Owner", status: "warning" }
      ],
      characteristics: ["Independent", "Athletic", "Vocal", "Friendly"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    {
      petId: 5,
      name: "Bella",
      age: "4 years",
      location: "Colaba",
      weight: "20 kg",
      breed: "Beagle",
      gender: "Female",
      description: "Bella is a sweet Beagle who loves to sniff and explore her surroundings.",
      traits: [
        { text: "Spayed", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "House Trained", status: "success" },
        { text: "Good with Cats", status: "warning" },
        { text: "Good with Dogs", status: "success" },
        { text: "Good with Kids", status: "success" }
      ],
      characteristics: ["Curious", "Friendly", "Gentle", "Active"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    }
  ],
  cats: [
    {
      petId: 6,
      name: "Whiskers",
      age: "4 years",
      location: "Dadar",
      weight: "4 kg",
      breed: "Persian",
      gender: "Female",
      description: "Whiskers is a gentle Persian cat who enjoys lounging in sunny spots and gentle petting.",
      traits: [
        { text: "Spayed", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "Indoor Only", status: "warning" },
        { text: "Good with Cats", status: "success" },
        { text: "Needs Quiet Home", status: "warning" },
        { text: "Good with Kids", status: "success" }
      ],
      characteristics: ["Gentle", "Quiet", "Trained", "Healthy"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    {
      petId: 7,
      name: "Oliver",
      age: "2 years",
      location: "Worli",
      weight: "5 kg",
      breed: "Maine Coon",
      gender: "Male",
      description: "Oliver is a majestic Maine Coon with a luxurious coat and friendly disposition.",
      traits: [
        { text: "Neutered", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "Good with Dogs", status: "success" },
        { text: "Good with Cats", status: "success" },
        { text: "Good with Kids", status: "success" },
        { text: "Needs Grooming", status: "warning" }
      ],
      characteristics: ["Sociable", "Affectionate", "Intelligent", "Gentle"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    {
      petId: 8,
      name: "Luna",
      age: "1 year",
      location: "Kandivali",
      weight: "3 kg",
      breed: "Siamese",
      gender: "Female",
      description: "Luna is a vocal Siamese cat who loves attention and interactive play.",
      traits: [
        { text: "Spayed", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "Indoor Only", status: "warning" },
        { text: "Vocal", status: "warning" },
        { text: "Good with Cats", status: "success" },
        { text: "Needs Activity", status: "warning" }
      ],
      characteristics: ["Vocal", "Active", "Smart", "Playful"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    {
      petId: 9,
      name: "Milo",
      age: "3 years",
      location: "Malad",
      weight: "4.5 kg",
      breed: "Russian Blue",
      gender: "Male",
      description: "Milo is a shy but loving Russian Blue who bonds deeply with his chosen family.",
      traits: [
        { text: "Neutered", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "Shy", status: "warning" },
        { text: "Good with Cats", status: "success" },
        { text: "Needs Patience", status: "warning" },
        { text: "Indoor Only", status: "warning" }
      ],
      characteristics: ["Quiet", "Reserved", "Loyal", "Gentle"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    {
      petId: 10,
      name: "Sophie",
      age: "5 years",
      location: "Thane",
      weight: "3.8 kg",
      breed: "British Shorthair",
      gender: "Female",
      description: "Sophie is a laid-back British Shorthair who enjoys a peaceful home environment.",
      traits: [
        { text: "Spayed", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "House Trained", status: "success" },
        { text: "Good with Cats", status: "success" },
        { text: "Good with Kids", status: "success" },
        { text: "Calm Nature", status: "success" }
      ],
      characteristics: ["Calm", "Independent", "Affectionate", "Easy-going"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    }
  ],
  rabbits: [
    {
      petId: 11,
      name: "Hoppy",
      age: "1 year",
      location: "Andheri",
      weight: "2 kg",
      breed: "Holland Lop",
      gender: "Male",
      description: "Hoppy is an adorable Holland Lop with floppy ears who loves to binky and explore.",
      traits: [
        { text: "Neutered", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "Indoor Only", status: "warning" },
        { text: "Litter Trained", status: "success" },
        { text: "Good with Rabbits", status: "success" },
        { text: "Needs Space", status: "warning" }
      ],
      characteristics: ["Playful", "Gentle", "Social", "Active"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    {
      petId: 12,
      name: "Cotton",
      age: "2 years",
      location: "Bandra",
      weight: "1.8 kg",
      breed: "Netherland Dwarf",
      gender: "Female",
      description: "Cotton is a tiny Netherland Dwarf with a big personality and loves to be petted.",
      traits: [
        { text: "Spayed", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "House Trained", status: "success" },
        { text: "Good with Kids", status: "success" },
        { text: "Needs Companionship", status: "warning" },
        { text: "Indoor Only", status: "warning" }
      ],
      characteristics: ["Curious", "Affectionate", "Energetic", "Smart"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    {
      petId: 13,
      name: "Thumper",
      age: "3 years",
      location: "Powai",
      weight: "2.5 kg",
      breed: "Mini Rex",
      gender: "Male",
      description: "Thumper is a velvet-furred Mini Rex who enjoys lounging and getting head rubs.",
      traits: [
        { text: "Neutered", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "Calm Nature", status: "success" },
        { text: "Good with Cats", status: "success" },
        { text: "Good with Kids", status: "success" },
        { text: "Needs Regular Grooming", status: "warning" }
      ],
      characteristics: ["Calm", "Friendly", "Well-mannered", "Clean"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    {
      petId: 14,
      name: "Luna",
      age: "1.5 years",
      location: "Juhu",
      weight: "3 kg",
      breed: "French Lop",
      gender: "Female",
      description: "Luna is a gentle giant French Lop who loves to flop and get belly rubs.",
      traits: [
        { text: "Spayed", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "House Trained", status: "success" },
        { text: "Good with Rabbits", status: "success" },
        { text: "Needs Exercise", status: "warning" },
        { text: "Large Space Required", status: "warning" }
      ],
      characteristics: ["Gentle", "Loving", "Relaxed", "Social"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    {
      petId: 15,
      name: "Oreo",
      age: "2 years",
      location: "Colaba",
      weight: "2.2 kg",
      breed: "Dutch",
      gender: "Male",
      description: "Oreo is a distinctive black and white Dutch rabbit who's full of energy and personality.",
      traits: [
        { text: "Neutered", status: "success" },
        { text: "Shots Up to Date", status: "success" },
        { text: "House Trained", status: "success" },
        { text: "Good with Kids", status: "success" },
        { text: "Active", status: "warning" },
        { text: "Needs Enrichment", status: "warning" }
      ],
      characteristics: ["Energetic", "Bold", "Intelligent", "Playful"],
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"]
    }
  ]
};