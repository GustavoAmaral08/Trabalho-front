function iniciarMenu() {
    const botao = document.querySelector('.menu-toggle');
    const menu = document.getElementById('menu-lista');
    if (!botao || !menu) return;

    function definirMenu(aberto) {
        menu.classList.toggle('aberto', aberto);
        botao.setAttribute('aria-expanded', String(aberto));
        botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
        botao.textContent = aberto ? '✕' : '☰';
    }

    botao.addEventListener('click', () => {
        definirMenu(!menu.classList.contains('aberto'));
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => definirMenu(false));
    });

    document.addEventListener('keydown', evento => {
        if (evento.key === 'Escape') definirMenu(false);
    });

    window.matchMedia('(min-width: 601px)').addEventListener('change', evento => {
        if (evento.matches) definirMenu(false);
    });
}


function iniciarSlider() {
    const secao = document.querySelector('.promocoes');
    if (!secao) return;

    const imagem = secao.querySelector('img');
    const titulo = secao.querySelector('h2');
    const anterior = secao.querySelector('button[aria-label="Promoção anterior"]');
    const proximo = secao.querySelector('button[aria-label="Próxima promoção"]');
    if (!imagem || !titulo || !anterior || !proximo) return;

    const banners = [
        { src: imagem.getAttribute('src'), alt: imagem.alt, titulo: titulo.textContent.trim() },
        { src: 'images/banner-2.svg', alt: 'Banner de ofertas de eletrônicos', titulo: 'OFERTAS DE ELETRÔNICOS' },
        { src: 'images/banner-3.svg', alt: 'Banner de ofertas de casa e moda', titulo: 'OFERTAS DE CASA E MODA' }
    ];
    let atual = 0;
    let temporizador;

  
    titulo.setAttribute('aria-live', 'polite');

    function mostrar(indice) {
        atual = (indice + banners.length) % banners.length;
        imagem.style.opacity = 0;


        clearTimeout(temporizador);
        temporizador = setTimeout(() => {
            imagem.src = banners[atual].src;
            imagem.alt = banners[atual].alt;
            titulo.textContent = banners[atual].titulo;
            imagem.style.opacity = 1;
        }, 250);
    }

    anterior.addEventListener('click', () => mostrar(atual - 1));
    proximo.addEventListener('click', () => mostrar(atual + 1));
}


function iniciarCarrinho() {
    const link = document.querySelector('.fotoCarrinho');
    const contador = document.getElementById('contador-carrinho');
    if (!link || !contador) return;

    let total = 0;


    contador.setAttribute('aria-live', 'polite');

    function atualizar() {
        const texto = total === 1 ? '1 item' : `${total} itens`;
        contador.textContent = `(${texto})`;
        link.setAttribute('aria-label', `Carrinho de compras com ${texto}`);
    }

    document.querySelectorAll('.produto button').forEach(botao => {
        const textoOriginal = botao.textContent.trim();
        let temporizador;

        botao.addEventListener('click', () => {
            total++;
            atualizar();

            botao.textContent = 'Adicionado ✓';
            clearTimeout(temporizador);
            temporizador = setTimeout(() => {
                botao.textContent = textoOriginal;
            }, 1200);
        });
    });
}


function iniciarRevelarAoRolar() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observador = new IntersectionObserver((entradas, obs) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                obs.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.categorias article, .produto').forEach(elemento => {
        elemento.classList.add('revelar');
        observador.observe(elemento);
    });
}


function iniciarCadastro() {
    const botao = document.getElementById('abrir-cadastro');
    const formulario = document.getElementById('area-cadastro');
    const mensagem = document.getElementById('mensagem-cadastro');
    if (!botao || !formulario || !mensagem) return;

    const campoNome = document.getElementById('nome');
    const campoEmail = document.getElementById('email');
    const campoSenha = document.getElementById('senha');
    if (!campoNome || !campoEmail || !campoSenha) return;

    const campos = [campoNome, campoEmail, campoSenha];
    const textoPadrao = 'Entrar / Conta';
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    mensagem.setAttribute('role', 'alert');
    mensagem.setAttribute('aria-live', 'assertive');

    botao.setAttribute('aria-controls', 'area-cadastro');
    botao.setAttribute('aria-expanded', String(!formulario.hidden));

    function definirFormulario(aberto) {
        formulario.hidden = !aberto;
        botao.textContent = aberto ? 'Fechar Cadastro' : textoPadrao;
        botao.setAttribute('aria-expanded', String(aberto));
        if (aberto) campoNome.focus();
    }

    function limparErros() {
        mensagem.textContent = '';
        mensagem.classList.remove('erro', 'sucesso');
        campos.forEach(campo => campo.removeAttribute('aria-invalid'));
    }

    function mostrarErro(campo, texto) {
        mensagem.textContent = texto;
        mensagem.classList.add('erro');
        campo.setAttribute('aria-invalid', 'true');
        campo.focus();
    }


    function validar() {
        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim();
        const senha = campoSenha.value;

        if (!nome) {
            mostrarErro(campoNome, 'Informe seu nome.');
            return false;
        }
        if (nome.length < 3) {
            mostrarErro(campoNome, 'O nome deve ter pelo menos 3 caracteres.');
            return false;
        }
        if (!email) {
            mostrarErro(campoEmail, 'Informe seu e-mail.');
            return false;
        }
        if (!regexEmail.test(email)) {
            mostrarErro(campoEmail, 'Digite um e-mail válido (ex.: nome@dominio.com).');
            return false;
        }
        if (!senha) {
            mostrarErro(campoSenha, 'Informe uma senha.');
            return false;
        }
        if (senha.length < 6) {
            mostrarErro(campoSenha, 'A senha deve ter pelo menos 6 caracteres.');
            return false;
        }
        return true;
    }

    botao.addEventListener('click', evento => {
        evento.preventDefault();
        definirFormulario(formulario.hidden);
    });

    document.addEventListener('keydown', evento => {
        if (evento.key === 'Escape' && !formulario.hidden) {
            definirFormulario(false);
            botao.focus();
        }
    });

    campos.forEach(campo => {
        campo.addEventListener('input', () => {
            if (campo.hasAttribute('aria-invalid')) limparErros();
        });
    });

    formulario.addEventListener('submit', evento => {
        evento.preventDefault();
        limparErros();

        if (!validar()) return;

        formulario.reset();

        if (formulario.contains(mensagem)) {
            botao.textContent = 'Fechar Cadastro';
        } else {
            definirFormulario(false);
        }

        mensagem.textContent = 'Cadastro realizado com sucesso!';
        mensagem.classList.add('sucesso');
    });
}


document.addEventListener('DOMContentLoaded', () => {
    iniciarCadastro();
    iniciarMenu();
    iniciarSlider();
    iniciarCarrinho();
    iniciarRevelarAoRolar();
});
