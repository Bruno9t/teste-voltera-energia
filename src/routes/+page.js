/**
 * Função load() do SvelteKit responsável por consultar a API agify.io
 * Esta função é executada sempre que a rota é carregada ou os parâmetros mudam
 * @param {Object} params - Parâmetros da função load
 * @param {URL} params.url - URL da requisição contendo a query string
 * @returns {Object} Dados para serem utilizados no componente
 */
export async function load({ url }) {
	// Extrai o nome e país da query string da URL
	const name = url.searchParams.get('name');
	const country = url.searchParams.get('country');
	
	// Se não há nome ou o nome está vazio, retorna dados iniciais
	if (!name || name.trim() === '') {
		return {
			name: '',
			country: country || '',
			ageData: null,
			error: null
		};
	}
	
	try {
		// Monta a URL da API com parâmetro de país opcional
		let apiUrl = `https://api.agify.io?name=${encodeURIComponent(name.trim())}`;
		if (country && country.trim()) {
			apiUrl += `&country_id=${encodeURIComponent(country.trim())}`;
		}
		
		// Faz a requisição para a API agify.io
		const response = await fetch(apiUrl);
		
		// Verifica se a resposta foi bem-sucedida
		if (!response.ok) {
			throw new Error(`Erro na API: ${response.status}`);
		}
		
		// Converte a resposta para JSON
		const ageData = await response.json();
		
		return {
			name: name.trim(),
			country: country || '',
			ageData,
			error: null
		};
	} catch (error) {
		// Em caso de erro, retorna o nome e informações de erro
		return {
			name: name.trim(),
			country: country || '',
			ageData: null,
			error: error.message
		};
	}
} 