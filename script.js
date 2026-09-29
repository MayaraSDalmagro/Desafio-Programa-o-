
const btnTema = document.querySelector('#btn-tema');
const cardForm = document.querySelector('#card-form');
const inputMotorista = document.querySelector('#motorista');
const inputPlaca = document.querySelector('#placa');
const inputSenha = document.querySelector('#senha');
const btnVerSenha = document.querySelector('#btn-ver-senha');
const btnAgendar = document.querySelector('#btn-agendar');
const textoHorario = document.querySelector('#horario-selecionado');
const listaAgendamentos = document.querySelector('#lista-agendamentos');
const notificacao = document.querySelector('#notificacao');

const imgExpi = document.querySelector('#img-status-expi');
const textoExpi = document.querySelector('#texto-status-expi');
const imgExpii = document.querySelector('#img-status-expii');
const textoExpii = document.querySelector('#texto-status-expii');

const selectDoca = document.querySelector('#select-doca');
const btnIniciar = document.querySelector('#btn-iniciar');
const btnPausar = document.querySelector('#btn-pausar');
const btnReset = document.querySelector('#btn-reset');

// Seleção por classe
const relogioSistema = document.querySelector('.relogio-sistema');
const displayTempo = document.querySelector('.display-tempo');
const botoesHorario = document.querySelectorAll('.btn-horario'); 
const radiosExpedicao = document.querySelectorAll('input[name="expedicao"]');

// Variáveis para guardar dados e os tempos
let horaEscolhida = "";
let timerNotificacao;
let cronometro;
let segundos = 0;
let totalAgendamentos = 0;

// MÓDULO 05: CONTROLAR O TEMPO (Relógio no topo)
function atualizarRelogio() {
    const data = new Date();
    let horas = data.getHours();
    let minutos = data.getMinutes();
    let seg = data.getSeconds();
    
    // Adicionar um zero à esquerda se for menor que 10
    if (horas < 10) { horas = "0" + horas; }
    if (minutos < 10) { minutos = "0" + minutos; }
    if (seg < 10) { seg = "0" + seg; }
    
    relogioSistema.innerText = horas + ":" + minutos + ":" + seg;
}
// Repete a função a cada 1 segundo (1000 milissegundos)
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// MÓDULO 03: CLASSES E ESTILOS (Modo Escuro e Hover)
btnTema.addEventListener('click', function() {
    // Liga e desliga a classe modo-escuro no body
    document.body.classList.toggle('modo-escuro');
    
    if (document.body.classList.contains('modo-escuro')) {
        btnTema.innerText = "Modo Claro";
    } else {
        btnTema.innerText = "Modo Escuro";
    }
});

// Efeitos de passar o rato no cartão do formulário
cardForm.addEventListener('mouseover', function() {
    cardForm.classList.add('card-ativo');
});
cardForm.addEventListener('mouseout', function() {
    cardForm.classList.remove('card-ativo');
});

// MÓDULO 02 E 04: LER INPUTS, EVENTOS E VALIDAÇÃO

// Saber qual expedição está marcada nos Radio Buttons
function pegarExpedicaoMarcada() {
    let selecionada = "EXPI";
    for (let i = 0; i < radiosExpedicao.length; i++) {
        if (radiosExpedicao[i].checked === true) {
            selecionada = radiosExpedicao[i].value;
        }
    }
    return selecionada;
}

// Verifica se podemos ativar o botão de Agendar
function validarFormulario() {
    const motorista = inputMotorista.value.trim();
    const placa = inputPlaca.value.trim();
    const exp = pegarExpedicaoMarcada();
    const senha = inputSenha.value.trim();
    
    let tudoCerto = true;

    if (motorista === "") { tudoCerto = false; }
    if (placa.length < 7) { tudoCerto = false; }
    if (horaEscolhida === "") { tudoCerto = false; }
    
    // Se for EXPII, a senha tem que ser 1234
    if (exp === "EXPII" && senha !== "1234") {
        tudoCerto = false;
    }

    // Ativa ou desativa o botão (Módulo 04 - propriedade disabled)
    if (tudoCerto === true) {
        btnAgendar.disabled = false;
    } else {
        btnAgendar.disabled = true;
    }
}

// Ouvir quando o utilizador escreve nos campos
inputMotorista.addEventListener('input', validarFormulario);
inputSenha.addEventListener('input', validarFormulario);

// Forçar a matrícula a ficar em letras maiúsculas
inputPlaca.addEventListener('input', function() {
    inputPlaca.value = inputPlaca.value.toUpperCase();
    validarFormulario();
});

// Quando muda a expedição, bloqueia/desbloqueia a senha
for (let i = 0; i < radiosExpedicao.length; i++) {
    radiosExpedicao[i].addEventListener('change', function() {
        const exp = pegarExpedicaoMarcada();
        if (exp === "EXPII") {
            inputSenha.disabled = false;
        } else {
            inputSenha.disabled = true;
            inputSenha.value = ""; // limpa a senha
        }
        validarFormulario();
    });
}

// Escolher um horário clicando nos botões
for (let i = 0; i < botoesHorario.length; i++) {
    botoesHorario[i].addEventListener('click', function() {
        horaEscolhida = botoesHorario[i].value;
        textoHorario.innerText = "Horário escolhido: " + horaEscolhida;
        validarFormulario();
    });
}

// Botão de ver senha 
btnVerSenha.addEventListener('mousedown', function() {
    inputSenha.type = 'text';
});
btnVerSenha.addEventListener('mouseup', function() {
    inputSenha.type = 'password';
});
btnVerSenha.addEventListener('mouseleave', function() {
    inputSenha.type = 'password'; // Garante que esconde se tirar o rato
});

// Ação principal: Agendar
btnAgendar.addEventListener('click', function() {
    const motorista = inputMotorista.value.trim();
    const placa = inputPlaca.value.trim();
    const exp = pegarExpedicaoMarcada();
    
    // Apaga a mensagem inicial se for o primeiro agendamento
    if (totalAgendamentos === 0) {
        listaAgendamentos.innerText = ""; 
    }
    
    // Cria o texto do novo agendamento com concatenação simples
    const textoAgendamento = "<div class='item-lista'>" +
        "<strong>" + horaEscolhida + " - " + exp + "</strong><br>" +
        "Veículo: " + placa + " | Motorista: " + motorista +
        "</div>";
        
    listaAgendamentos.innerHTML = listaAgendamentos.innerHTML + textoAgendamento;
    totalAgendamentos++;

    // Módulo 05: Notificação com setTimeout
    notificacao.innerText = "Veículo agendado com sucesso!";
    notificacao.classList.remove('escondido');
    
    // Limpa o timer anterior para a mensagem não piscar
    clearTimeout(timerNotificacao);
    timerNotificacao = setTimeout(function() {
        notificacao.classList.add('escondido');
    }, 3000);

    // Limpar os campos para o próximo agendamento
    inputMotorista.value = "";
    inputPlaca.value = "";
    inputSenha.value = "";
    horaEscolhida = "";
    textoHorario.innerText = "Nenhum horário selecionado";
    validarFormulario();
});

// CRONÓMETRO E MUDANÇA DA IMAGEM E TEXTO
function atualizarVisual(doca, ocupado) {
    let imagem, texto;
    
    if (doca === "EXPI") {
        imagem = imgExpi;
        texto = textoExpi;
    } else {
        imagem = imgExpii;
        texto = textoExpii;
    }

    if (ocupado === true) {
        imagem.src = "./img/ocupada.png"; // Módulo 04: mudar a imagem
        texto.innerText = "EM OPERAÇÃO";
        texto.classList.remove('cor-livre');
        texto.classList.add('cor-ocupada');
    } else {
        imagem.src = "./img/livre.png";
        texto.innerText = "LIVRE";
        texto.classList.remove('cor-ocupada');
        texto.classList.add('cor-livre');
    }
}

function contarTempo() {
    segundos++;
    let min = Math.floor(segundos / 60);
    let seg = segundos % 60;
    
    if (min < 10) { min = "0" + min; }
    if (seg < 10) { seg = "0" + seg; }
    
    displayTempo.innerText = min + ":" + seg;
}

btnIniciar.addEventListener('click', function() {
    const doca = selectDoca.value;
    atualizarVisual(doca, true);
    
    btnIniciar.disabled = true;
    btnPausar.disabled = false;
    selectDoca.disabled = true;
    
    clearInterval(cronometro); // Módulo 05: limpar intervalos
    cronometro = setInterval(contarTempo, 1000); // Módulo 05: iniciar intervalos
});

btnPausar.addEventListener('click', function() {
    clearInterval(cronometro);
    btnIniciar.disabled = false;
    btnPausar.disabled = true;
});

btnReset.addEventListener('click', function() {
    clearInterval(cronometro);
    segundos = 0;
    displayTempo.innerText = "00:00";
    
    const doca = selectDoca.value;
    atualizarVisual(doca, false);
    
    btnIniciar.disabled = false;
    btnPausar.disabled = true;
    selectDoca.disabled = false;
});