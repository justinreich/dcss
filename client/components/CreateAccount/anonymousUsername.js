const animals = 'aardvark akita albatross alligator alpaca angelfish ant anteater antelope ape armadillo baboon badger bandicoot barnacle barracuda bat beagle bear beaver bee beetle bird bison bloodhound boar bobcat bonobo buffalo bulldog bullfrog butterfly caiman camel capybara caracal caribou cassowary cat caterpillar catfish cattle centipede chameleon chamois cheetah chicken chihuahua chimpanzee chinchilla chinook chipmunk clam cobra collie coral cougar coyote crab crane crocodile crow cuttlefish dachshund dalmatian deer dingo dinosaur dodo dogfish dolphin donkey dormouse dotterel dove dragonfly duck eagle eel elephant elk emu falcon ferret finch fish flamingo flounder fox frog gazelle gecko gerbil gibbon giraffe gnu goat goldfinch goldfish goose gopher gorilla goshawk grasshopper greyhound grouse gull guppy hamster hare harrier hawk hedgehog heron herring himalayan hippopotamus hornet horse human hummingbird hyena ibis iguana impala indri insect jackal jaguar bluejay jellyfish kangaroo kelpie kingfisher kiwi koala dragon labradoodle ladybird lapwing lark lemming lemur leopard liger lion lionfish lizard llama lobster locust loris lynx lyrebird macaw magpie mallard manatee mandrill mastiff meerkat mink mole mongoose monkey moorhen moose mosquito moth mouse mule narwhal newt nightingale ocelot octopus okapi opossum orangutan oryx ostrich otter owl ox oyster pademelon panther parrot partridge peacock peafowl pelican penguin persian pheasant pig pigeon piranha platypus pointer pony poodle porcupine porpoise possum prairie dog prawn puffin pug puma quail rabbit raccoon ragdoll rail ram rat rattlesnake raven panda reindeer rhinoceros robin rook rottweiler salamander salmon sand-dollar sandpiper sardine scorpion sea-lion seahorse seal shark sheep shrew shrimp skunk sloth snail snake snowshoe sparrow spider sponge squid squirrel starfish starling stingray stork swallow swan tang tapir tarsier termite tetra tiger toad tortoise toucan trout turkey turtle umbrellabird urchin viper vulture wallaby walrus warthog wasp weasel whale whippet wildebeest wolf wolverine wombat woodpecker wren xeme xolo yak yellowhammer zebra zebu zonkey zorse'.split(
    ' '
);

const adjectives = 'accountable adaptable adept adventurous affable agreeable alert alluring amazing ambitious amiable amusing attentive awesome boundless brave bright calm capable charming chatty cheerful clever coherent comfortable confident conscientious considerate consistent convivial cooperative courageous creative credible cultured dashing dazzling debonair decisive decorous delightful dependable detailed determined diligent diplomatic discerning discreet dynamic eager eclectic efficient elated eminent enchanting encouraging endurable energetic enterprising entertaining enthusiastic epic excellent excited exclusive exuberant fabulous fair fair-minded faithful fantastic favorable fearless fine flourished flowing focused forceful forgiving fortuitous frank free free-spirited friendly fulfilled fun fun-loving funny generous genial genius gentle genuine giving glad glorious glowing goddess good goodhealth goodness graceful gracious grateful great gregarious groundbreaking grounded happy happy-hearted hard-working hardworking harmonious healthy heartfull heartwarming heaven helpful high-spirited hilarious holy honest honorable hopeful humorous illuminated imaginative impartial incomparable incredible independent industrious ineffable ingenious innovative inscrutable insightful inspirational inspired instinctive intellectual intelligent intuitive inventive invigorated involved irresistible jazzed jolly jovial joyful joyous jubilant juicy just juvenescent kalon kind kind-hearted kissable knowingly knowledgeable kooky level likeable lively logical lovable loved lovely loving loyal lucky luxurious magical magnificent marvelous mature memorable meticulous mind-blowing mindful miracle miraculous mirthful modern modest multi-talented neat nice nirvana noble nourished nurtured obedient observant open open-hearted open-minded optimistic opulent organised organized original outstanding owning-my-power painstaking passionate patient peaceful perceptive perfect persistent philosophical pioneering placid plausible playful pleasant plucky polite positive powerful practical precious pro-active proactive productive professional propitious prosperous protective proud punctual quick-witted quiet radiant radical rational ready receptive reflective refreshed rejuvenated relaxed reliable relieved remarkable renewed reserved resilient resolute resourceful responsible rhetorical rich righteous robust romantic sacred safe satisfied secured sedate seemly selective self-accepting self-assured self-confident self-disciplined self-loving sensational sensible sensitive serene sharp shining shrewd shy silly sincere skillful smart smiling sociable sophisticated soulful spectacular splendid steadfast stellar stimulating straightforward strategic strong studious stupendous successful succinct super sustained sympathetic sympathetic* talented thankful thoughtful thrifty thrilled thriving tidy tough tranquil triumphant trusting trustworthy ultimate unassuming unbelievable unbiased understanding unique unlimited unprecedented unreal unusual upbeat uplifted valuable versatile vibrant victorious vigorous vivacious voracious warm warmhearted wealthy welcomed whole wholeheartedly willing wise witty wonderful wondrous worthy xoxo young-at-heart youthful yummy zappy zealous zestful'.split(
    ' '
);

export default function() {
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${adjective}-${animal}`;
}
