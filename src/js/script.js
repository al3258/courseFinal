const randomPokemonButton = document.getElementById('random-pokemon');
const pokemonStatsDiv = document.getElementById('pokemon-stats');
const pokemonName = document.getElementById('pokemon-name');
const pokemonHeight = document.getElementById('pokemon-height');
const pokemonWeight = document.getElementById('pokemon-weight');
const pokemonType = document.getElementById('pokemon-type');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonEvolution = document.getElementById('pokemon-evolution');
const pokemonAbilities = document.getElementById('pokemon-abilities');

function createPopover(element, content) {
    const popover = document.createElement('div');
    popover.className = 'popover';
    popover.textContent = content;
    document.body.appendChild(popover);

    const rect = element.getBoundingClientRect();
    popover.style.top = `${rect.bottom + window.scrollY}px`;
    popover.style.left = `${rect.left + window.scrollX}px`;

    return popover;
}

function fetchPokemonData() {
    fetch('https://pokeapi.co/api/v2/pokemon-species')
        .then(response => response.json())
        .then(speciesData => {
            const pokemonList = speciesData.results;
            const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];

            fetch(randomPokemon.url)
                .then(pokemonResponse => pokemonResponse.json())
                .then(pokemonData => {
                    const pokemonId = pokemonData.id;

                    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                        .then(pokemonDetailsResponse => pokemonDetailsResponse.json())
                        .then(pokemonDetailsData => {
                            pokemonName.textContent = pokemonData.name;
                            pokemonHeight.textContent = `Height: ${pokemonDetailsData.height / 10} m`;
                            pokemonWeight.textContent = `Weight: ${pokemonDetailsData.weight / 10} kg`;
                            pokemonImage.src = pokemonDetailsData.sprites.front_default;
                            pokemonImage.alt = pokemonData.name;

                            pokemonType.textContent = `Type(s): ${pokemonDetailsData.types.map(type => type.type.name).join(', ')}`;

                            let abilitiesHTML = 'Abilities: ';
                            const abilityPromises = pokemonDetailsData.abilities.map((ability, index) => {
                                return fetch(ability.ability.url)
                                    .then(abilityResponse => abilityResponse.json())
                                    .then(abilityData => {
                                        let description = abilityData.effect_entries.find(entry => entry.language.name === 'en')?.short_effect || 'Description not available';
                                        description = description.replace(/'/g, "'").replace(/moves'/g, "moves");
                                        abilitiesHTML += `<a href="#" class="ability-link" data-description="${description}" >${ability.ability.name}</a>`;
                                    })
                                    .finally(() => {
                                        if (index < pokemonDetailsData.abilities.length - 1) {
                                            abilitiesHTML += ', ';
                                        }
                                    });
                            });

                            Promise.all(abilityPromises).then(() => {
                                pokemonAbilities.innerHTML = abilitiesHTML;
                                addPopoverListeners();
                            });

                            if (pokemonData.evolution_chain && pokemonData.evolution_chain.url) {
                                fetch(pokemonData.evolution_chain.url)
                                    .then(evolutionResponse => evolutionResponse.json())
                                    .then(evolutionData => {
                                        const evolutionChain = getEvolutionChain(evolutionData.chain);
                                        pokemonEvolution.textContent = `Evolution Chain: ${evolutionChain.join(' → ')}`;
                                    });
                            } else {
                                pokemonEvolution.textContent = 'Evolution Chain: N/A';
                            }
                        });
                });
        });
}

function getEvolutionChain(chain) {
    const evolutionChain = [chain.species.name];
    let nextEvolution = chain.evolves_to;

    while (nextEvolution && nextEvolution.length > 0) {
        evolutionChain.push(nextEvolution[0].species.name);
        nextEvolution = nextEvolution[0].evolves_to;
    }

    return evolutionChain;
}

function addPopoverListeners() {
    document.querySelectorAll('.ability-link').forEach(link => {
        let popover;

        link.addEventListener('mouseover', (event) => {
            const description = event.target.dataset.description;
            popover = createPopover(event.target, description);
        });

        link.addEventListener('mouseout', () => {
            if (popover) {
                popover.remove();
                popover = null;
            }
        });
    });
}

randomPokemonButton.addEventListener('click', fetchPokemonData);