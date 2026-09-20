export const MOCK_TRANSCRIPTS = {
    'animal-naming': {
        high: {
            text: "Dog, cat, elephant, tiger, lion, giraffe, bear, monkey, zebra, kangaroo, dolphin, shark, whale, penguin, eagle, hawk, owl, snake, lizard, frog, toad, hamster, rabbit, deer, squirrel.",
            highlights: ["Dog", "cat", "elephant", "tiger", "lion", "giraffe", "bear", "monkey", "zebra", "kangaroo", "dolphin", "shark", "whale", "penguin", "eagle", "hawk", "owl", "snake", "lizard", "frog", "toad", "hamster", "rabbit", "deer", "squirrel"],
            metrics: { duration: "60s", wordsCount: 25, repeats: 0, pauses: "2.1s total" }
        },
        moderate: {
            text: "Dog, cat, ... tiger, lion, ... cow, pig, horse, ... bird, fish, ... turtle, frog, ... elephant, ... bear, squirrel. Let me think. Um... rabbit, hamster.",
            highlights: ["Dog", "cat", "tiger", "lion", "cow", "pig", "horse", "bird", "fish", "turtle", "frog", "elephant", "bear", "squirrel", "rabbit", "hamster"],
            metrics: { duration: "60s", wordsCount: 16, repeats: 0, pauses: "12.4s total" }
        },
        low: {
            text: "Dog... cat... um... horse... cow... cow (repeat)... pig... um... sheep... and... chicken... dog (repeat)... let me see. Um... bird. That's all I can think of right now.",
            highlights: ["Dog", "cat", "horse", "cow", "cow", "pig", "sheep", "chicken", "dog", "bird"],
            metrics: { duration: "60s", wordsCount: 8, repeats: 2, pauses: "31.8s total" }
        }
    },
    'picture-recall': {
        high: {
            text: "I see a bright yellow sun in the sky with a few fluffy white clouds. There is green grass with some pink and orange flowers growing. In the center, there is a brown bench on a sandy path, and a light brown dog is lying down next to the bench. On the left and right sides of the image, there are green leafy trees with brown trunks.",
            highlights: ["sun", "clouds", "grass", "flowers", "bench", "dog", "trees"],
            metrics: { duration: "52s", recallAccuracy: "94%", pauses: "1.8s total" }
        },
        moderate: {
            text: "It is a park scene. There is a yellow sun and a cloud in the blue sky. Below is grass with a couple of trees. I see a bench in the middle on some sand, and there is a dog or a small animal lying near the bench. There are also some small colored spots that look like flowers.",
            highlights: ["sun", "sky", "grass", "trees", "bench", "dog", "flowers"],
            metrics: { duration: "56s", recallAccuracy: "71%", pauses: "6.5s total" }
        },
        low: {
            text: "There is... um... a tree... and the sun is yellow. There is a bench in the park... and... let me think. Oh, yes, there is a dog. The grass is green. I don't remember much else... maybe some clouds.",
            highlights: ["tree", "sun", "bench", "dog", "grass", "clouds"],
            metrics: { duration: "60s", recallAccuracy: "43%", pauses: "22.0s total" }
        }
    },
    'structured-speech': {
        topics: [
            {
                prompt: 'Describe your typical morning routine in as much detail as possible.',
                high: "I usually wake up at seven AM, stretch, and head to the kitchen to make a fresh cup of coffee. While it brews, I step outside to check the weather. Then, I feed the cat, eat oatmeal with bananas, wash the dishes, brush my teeth, and read the morning newspaper for about thirty minutes before starting my day.",
                moderate: "I wake up... around eight. I make tea and toast. Then I wash up, brush my teeth. Sometimes I go for a short walk down the street or sit in the living room. Then I read a bit and do some house cleaning.",
                low: "I get up... make coffee. Then... I don't know, sit for a while. I watch the news. It is... slow. Then I get dressed... eat some breakfast. That is... that is my morning."
            },
            {
                prompt: 'Talk about your favorite place you have ever visited.',
                high: "My favorite place is definitely the Grand Canyon. We went there during the autumn when the air was crisp. Standing at the edge of the rim and seeing the massive layers of red and orange rock stretch out for miles was absolutely breathtaking. We watched the sunset paint the sky in deep purples and pinks.",
                moderate: "My favorite place was Yosemite park. We saw the big granite rocks and waterfalls. It was very pretty and quiet. We walked along the trails and saw some deer in the meadow. I would love to go back there again.",
                low: "I liked... going to the beach. It was Florida, I think. Very warm... sand and water. We walked... on the sand. It was nice. I was... with family. It was... long ago."
            },
            {
                prompt: 'Describe the last meal you cooked or ate at home.',
                high: "Yesterday evening I cooked a fresh pasta dish. I boiled some penne pasta and made a homemade sauce using crushed tomatoes, garlic, fresh basil leaves, and olive oil. I also grilled a chicken breast on the side and served it with a small green salad dressed with vinaigrette.",
                moderate: "Last night I made soup. It was vegetable soup with carrots, celery, and potatoes. I had some bread with butter on the side. It was simple but hot and tasted good on a cold evening.",
                low: "I ate... some chicken. And potatoes... boiled. My daughter cooked it. It was... good. I drank... some water. That was it."
            },
            {
                prompt: 'Tell me about someone who has been important in your life.',
                high: "An important person in my life is my grandmother. She was a school teacher for forty years and always encouraged my curiosity. She taught me how to read, how to plant tomatoes in the garden, and how to stay patient and kind even when things get difficult. Her wisdom stays with me every single day.",
                moderate: "My husband has been very important to me. We have been married for forty-two years. He is very patient and helps me around the house. He is a good listener and always makes me laugh when I am feeling down.",
                low: "My mother... she was... very kind. She looked after us. We had... a big house. She liked... to sew. She was... important."
            },
            {
                prompt: 'Describe a hobby or activity you enjoy and why.',
                high: "I really enjoy gardening. I have a small vegetable patch in my backyard where I grow tomatoes, zucchini, cucumbers, and fresh herbs. Working with the soil, watering the plants every morning, and watching them grow from tiny seeds to fruitful plants is incredibly relaxing and keeps me active.",
                moderate: "I like reading mystery books. I go to the local library every week to find new novels. It keeps my mind busy and I like trying to solve the puzzle before the book ends. I usually read in the afternoon with some tea.",
                low: "I like... walking. In the park near my house. It has trees. I see... birds. It is quiet. I go... when it is sunny. It is... nice exercise."
            }
        ]
    }
};

export function getMockTranscript(type, score, prompt = '') {
    const tier = score >= 75 ? 'high' : score >= 60 ? 'moderate' : 'low';
    
    if (type === 'animal-naming') {
        return MOCK_TRANSCRIPTS['animal-naming'][tier];
    }
    if (type === 'picture-recall') {
        return MOCK_TRANSCRIPTS['picture-recall'][tier];
    }
    if (type === 'structured-speech') {
        const topicData = MOCK_TRANSCRIPTS['structured-speech'].topics.find(t => t.prompt === prompt) 
            || MOCK_TRANSCRIPTS['structured-speech'].topics[0];
        
        const text = topicData[tier];
        // Generate mock highlights from words that are long enough and not punctuation
        const highlights = text.split(' ')
            .map(w => w.replace(/[^\w]/g, ""))
            .filter(w => w.length > 4)
            .slice(0, 7);
        return {
            text,
            highlights,
            metrics: {
                duration: tier === 'high' ? "50s" : tier === 'moderate' ? "55s" : "60s",
                pauses: tier === 'high' ? "1.5s total" : tier === 'moderate' ? "5.4s total" : "18.2s total",
                coherence: tier === 'high' ? "95%" : tier === 'moderate' ? "76%" : "44%"
            }
        };
    }
    return { text: "No transcript available.", highlights: [], metrics: {} };
}
