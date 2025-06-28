<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

    import './+page.css';

	
	// Recebe os dados da função load()
	export let data;
	
	// Variável reativa para o valor do input
	let inputValue = data.name || '';
	
	// Variável reativa para o país selecionado
	let selectedCountry = data.country || '';
	
	// Lista de países com códigos ISO alpha-2
	const countries = [
		{ code: '', name: '🌍 Global (sem país específico)' },
		{ code: 'BR', name: '🇧🇷 Brasil' },
		{ code: 'US', name: '🇺🇸 Estados Unidos' },
		{ code: 'PT', name: '🇵🇹 Portugal' },
		{ code: 'ES', name: '🇪🇸 Espanha' },
		{ code: 'FR', name: '🇫🇷 França' },
		{ code: 'IT', name: '🇮🇹 Itália' },
		{ code: 'DE', name: '🇩🇪 Alemanha' },
		{ code: 'GB', name: '🇬🇧 Reino Unido' },
		{ code: 'CA', name: '🇨🇦 Canadá' },
		{ code: 'AU', name: '🇦🇺 Austrália' },
		{ code: 'JP', name: '🇯🇵 Japão' },
		{ code: 'KR', name: '🇰🇷 Coreia do Sul' },
		{ code: 'CN', name: '🇨🇳 China' },
		{ code: 'IN', name: '🇮🇳 Índia' },
		{ code: 'MX', name: '🇲🇽 México' },
		{ code: 'AR', name: '🇦🇷 Argentina' },
		{ code: 'CL', name: '🇨🇱 Chile' },
		{ code: 'CO', name: '🇨🇴 Colômbia' },
		{ code: 'PE', name: '🇵🇪 Peru' }
	];
	
	// Estado do dropdown
	let dropdownOpen = false;
	
	// Variável para controlar o timer do debounce
	let debounceTimer;
	
	/**
	 * Função que implementa o debounce para evitar muitas requisições
	 * Aguarda 500ms após o usuário parar de digitar antes de fazer a navegação
	 * @param {string} value - Valor digitado no input
	 */
	function handleInputChange(value) {
		// Limpa o timer anterior se existir
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		
		// Define um novo timer para executar após 500ms
		debounceTimer = setTimeout(() => {
			// Só navega se estivermos no browser (lado cliente)
			if (browser) {
				// Se o valor está vazio, limpa a query string
				if (!value.trim()) {
					goto('/', { replaceState: true, keepFocus: true });
				} else {
					// Monta a URL com nome e país (se selecionado)
					const params = new URLSearchParams();
					params.set('name', value.trim());
					if (selectedCountry) {
						params.set('country', selectedCountry);
					}
					goto(`/?${params.toString()}`, { replaceState: true, keepFocus: true });
				}
			}
		}, 500);
	}
	
	// Função para selecionar país
	async function selectCountry(countryCode) {
		console.log('Selecionando país:', countryCode);
		selectedCountry = countryCode;
		dropdownOpen = false;
		
		// Força o Svelte a atualizar a DOM
		await tick();
		console.log('País selecionado atualizado para:', selectedCountry);
		
		// Se já tem nome digitado, atualiza imediatamente
		if (inputValue.trim()) {
			handleInputChange(inputValue);
		}
	}
	
	// Variável reativa para o nome do país selecionado - atualiza automaticamente quando selectedCountry muda
	$: selectedCountryName = (() => {
		console.log('Atualizando país selecionado:', selectedCountry);
		if (!selectedCountry || selectedCountry === '') {
			return '🌍 Global (sem país específico)';
		}
		const country = countries.find(c => c.code === selectedCountry);
		console.log('País encontrado:', country);
		return country ? country.name : '🌍 Global (sem país específico)';
	})();
	
	// Reativo: quando inputValue muda, chama a função de debounce
	$: handleInputChange(inputValue);
	
	// Cleanup do timer quando o componente é destruído
	import { onDestroy, onMount, tick } from 'svelte';
	
	// Função para fechar dropdown quando clicar fora
	function handleClickOutside(event) {
		if (dropdownOpen && !event.target.closest('.country-dropdown')) {
			dropdownOpen = false;
		}
	}
	
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
	
	onDestroy(() => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
	});
</script>

<!-- 
	Estrutura HTML5 válida da aplicação
	Container principal com input e resultado
-->
<div class="background-wrapper">
	<!-- Elementos de fundo decorativos -->
	<div class="floating-shapes">
		<div class="shape shape-1"></div>
		<div class="shape shape-2"></div>
		<div class="shape shape-3"></div>
		<div class="shape shape-4"></div>
		<div class="shape shape-5"></div>
	</div>
	
	<main class="container">
		<!-- Cabeçalho da aplicação -->
		<header class="header">
			<div class="logo-container">
				<div class="logo-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</svg>
				</div>
				<div class="logo-text">
					<h1 class="title">AgeWise</h1>
					<div class="title-underline"></div>
				</div>
			</div>
			<p class="subtitle">
				<span class="highlight">Descubra</span> a idade estimada de qualquer nome
			</p>
		</header>
		
					<!-- Seção do formulário de entrada -->
		<section class="input-section">
			<div class="input-container">
				<!-- Efeitos de fundo do input -->
				<div class="input-background-effects">
					<div class="effect-circle effect-1"></div>
					<div class="effect-circle effect-2"></div>
					<div class="effect-circle effect-3"></div>
					<div class="effect-wave"></div>
				</div>
				
				<!-- Container principal do formulário -->
				<div class="form-container">
					<!-- Dropdown de países -->
					<div class="country-dropdown-section">
						<div class="country-label">
							<span>🌍 País para melhor precisão (opcional)</span>
						</div>
						<div class="country-dropdown" class:open={dropdownOpen}>
							<div class="dropdown-header" on:click={() => dropdownOpen = !dropdownOpen} on:keydown={(e) => e.key === 'Enter' && (dropdownOpen = !dropdownOpen)} tabindex="0" role="button" aria-expanded={dropdownOpen}>
								<span class="selected-country">{selectedCountryName}</span>
								<div class="dropdown-arrow" class:rotated={dropdownOpen}>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<polyline points="6,9 12,15 18,9"></polyline>
									</svg>
								</div>
							</div>
							{#if dropdownOpen}
								<div class="dropdown-menu">
									{#each countries as country}
										<div 
											class="dropdown-item" 
											class:selected={country.code === selectedCountry}
											on:click={() => selectCountry(country.code)}
											on:keydown={(e) => e.key === 'Enter' && selectCountry(country.code)}
											tabindex="0"
											role="option"
											aria-selected={country.code === selectedCountry}
										>
											{country.name}
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<!-- Seção do input principal -->
					<div class="name-input-section">
						<!-- Label externo com animação -->
						<div class="external-label" class:focused={inputValue.length > 0}>
							<span class="label-text">Digite um nome aqui</span>
							<div class="label-underline"></div>
						</div>
				
						<div class="input-wrapper" class:focused={inputValue.length > 0} class:typing={inputValue.length > 0}>
							<!-- Borda animada -->
							<div class="input-border-animation">
								<div class="border-segment segment-1"></div>
								<div class="border-segment segment-2"></div>
								<div class="border-segment segment-3"></div>
								<div class="border-segment segment-4"></div>
							</div>
							
							<!-- Ícone com animação -->
							<div class="input-icon-container">
								<div class="input-icon">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<circle cx="11" cy="11" r="8"></circle>
										<path d="m21 21-4.35-4.35"></path>
									</svg>
								</div>
								<div class="icon-ripple"></div>
							</div>
							
							<!-- Campo de input -->
							<div class="input-field-container">
								<input 
									id="name-input"
									type="text" 
									bind:value={inputValue}
									placeholder="Nome para análise..."
									class="name-input"
									autocomplete="off"
									spellcheck="false"
								/>
							</div>
							
							<!-- Indicador de progresso melhorado -->
							<div class="input-progress">
								<div class="progress-container">
									<div class="progress-bar">
										<div class="progress-fill" style="width: {Math.min((inputValue.length / 8) * 100, 100)}%"></div>
										<div class="progress-shimmer"></div>
									</div>
									<div class="progress-dots">
										<div class="dot" class:active={inputValue.length > 0}></div>
										<div class="dot" class:active={inputValue.length > 2}></div>
										<div class="dot" class:active={inputValue.length > 5}></div>
									</div>
								</div>
							</div>
							
							<!-- Efeitos visuais aprimorados -->
							<div class="input-glow"></div>
							<div class="input-shimmer"></div>
							<div class="input-aurora"></div>
							<div class="input-particles">
								<div class="particle particle-1"></div>
								<div class="particle particle-2"></div>
								<div class="particle particle-3"></div>
								<div class="particle particle-4"></div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Labels e hints modernos -->
				<div class="input-meta">
					
					<div class="input-hint" class:visible={inputValue.length === 0}>
						<div class="hint-icon">💡</div>
						<div class="hint-text">
							<strong>Dica:</strong> Experimente "Maria", "João", "Ana" ou "Pedro"
						</div>
					</div>
				</div>
			</div>
		</section>
		
		<!-- Seção dos resultados -->
		<section class="results-section">
			{#if data.ageData}
				<!-- Exibe o resultado quando há dados -->
				<div class="result-card">
					<div class="card-header">
						<div class="result-icon success">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9 12l2 2 4-4"></path>
								<circle cx="12" cy="12" r="10"></circle>
							</svg>
						</div>
						<h2 class="card-title">Análise Concluída</h2>
					</div>
					
					<div class="result-content">
						<div class="name-display">
							<span class="name-label">Nome analisado:</span>
							<h3 class="result-name">{data.ageData.name}</h3>
						</div>
						
						<div class="age-display">
							<div class="age-circle">
								<div class="age-number">{data.ageData.age}</div>
								<div class="age-text">anos</div>
							</div>
						</div>
						
						<div class="stats-container">
							<div class="stat-item">
								<div class="stat-icon">📊</div>
								<div class="stat-content">
									<div class="stat-label">Idade Estimada</div>
									<div class="stat-value">{data.ageData.age} anos</div>
								</div>
							</div>
							
							{#if data.ageData.count}
								<div class="stat-item">
									<div class="stat-icon">🔍</div>
									<div class="stat-content">
										<div class="stat-label">Base de Dados</div>
										<div class="stat-value">{data.ageData.count.toLocaleString('pt-BR')} registros</div>
									</div>
								</div>
							{/if}
							
							{#if data.ageData.country_id}
								<div class="stat-item">
									<div class="stat-icon">🌍</div>
									<div class="stat-content">
										<div class="stat-label">País Analisado</div>
										<div class="stat-value">{countries.find(c => c.code === data.ageData.country_id)?.name.replace(/^🇧🇷|🇺🇸|🇵🇹|🇪🇸|🇫🇷|🇮🇹|🇩🇪|🇬🇧|🇨🇦|🇦🇺|🇯🇵|🇰🇷|🇨🇳|🇮🇳|🇲🇽|🇦🇷|🇨🇱|🇨🇴|🇵🇪|🌍\s/, '') || data.ageData.country_id}</div>
									</div>
								</div>
							{/if}
						</div>
						
						<div class="confidence-bar">
							<div class="confidence-label">Confiabilidade</div>
							<div class="confidence-track">
								<div class="confidence-fill" style="width: 85%"></div>
							</div>
							<div class="confidence-value">85%</div>
						</div>
					</div>
				</div>
			{:else if data.error}
				<!-- Exibe erro se houver -->
				<div class="error-card">
					<div class="card-header">
						<div class="result-icon error">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="15" y1="9" x2="9" y2="15"></line>
								<line x1="9" y1="9" x2="15" y2="15"></line>
							</svg>
						</div>
						<h3 class="card-title">Erro na Consulta</h3>
					</div>
					<div class="error-content">
						<p class="error-message">{data.error}</p>
						<div class="error-suggestion">
							<strong>Sugestão:</strong> Verifique sua conexão e tente novamente.
						</div>
					</div>
				</div>
			{:else if inputValue.trim()}
				<!-- Loading state quando está carregando -->
				<div class="loading-card">
					<div class="loading-header">
						<div class="loading-spinner-container">
							<div class="loading-spinner"></div>
							<div class="spinner-glow"></div>
						</div>
						<h3 class="loading-title">Analisando...</h3>
					</div>
					<div class="loading-content">
						<p class="loading-text">
							Consultando base de dados para 
							<span class="loading-name">"{inputValue.trim()}"</span>
						</p>
						<div class="loading-steps">
							<div class="step active">🔍 Buscando dados</div>
							<div class="step">📊 Calculando estatísticas</div>
							<div class="step">✨ Gerando resultado</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- Estado inicial - instrução para o usuário -->
				<div class="welcome-card">
					<div class="welcome-header">
						<div class="welcome-icon-container">
							<div class="welcome-icon">🚀</div>
							<div class="icon-particles">
								<div class="particle"></div>
								<div class="particle"></div>
								<div class="particle"></div>
							</div>
						</div>
						<h3 class="welcome-title">Bem-vindo ao AgeWise!</h3>
					</div>
					
					<div class="welcome-content">
						<p class="welcome-description">
							Nosso site utiliza milhões de registros para 
							estimar a idade baseada em nomes. Experimente agora!
						</p>
						
						<div class="features-grid">
							<div class="feature-item">
								<div class="feature-icon">🎯</div>
								<div class="feature-text">Alta precisão</div>
							</div>
							<div class="feature-item">
								<div class="feature-icon">🌍</div>
								<div class="feature-text">Base global</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</section>
	</main>
</div>

