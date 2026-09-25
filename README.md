# Artful Image Studio

crie um gerador de imagem com i midelo em anexo mais essa prompt PROMPT FINAL — ATUALIZAÇÃO E FINALIZAÇÃO DO GERADOR DE IMAGENS

INSTRUÇÃO PRINCIPAL

O arquivo HTML que estou fornecendo é o gerador de imagens existente e já funcional.

Você deve trabalhar diretamente nesse projeto existente.

NÃO recrie o projeto do zero.

NÃO substitua o design existente.

NÃO remova funcionalidades existentes.

Sua tarefa é incrementar o gerador atual adicionando os novos controles descritos abaixo e integrar esses controles ao fluxo de geração sempre que a API/modelo utilizado realmente oferecer suporte.

O resultado final deve ser o mesmo gerador atual, porém mais completo.

1. REGRA ABSOLUTA — PRESERVAR O PROJETO

Preserve integralmente tudo que já existe no HTML.

Não alterar desnecessariamente:

layout;

estrutura;

design;

cores;

tipografia;

espaçamentos;

bordas;

ícones;

botões;

animações;

modo escuro;

responsividade;

campo de prompt;

sistema atual de geração;

integração atual com API;

chave da API;

histórico;

resultados;

download;

botão CRIAR;

botão EDITAR;

funcionalidades existentes.

NÃO fazer:

Não recriar o gerador.

Não trocar a identidade visual.

Não criar outro layout.

Não remover componentes.

Não renomear componentes existentes.

Não modificar o prompt original do usuário.

Não adicionar campos desnecessários.

Não criar uma segunda lógica de geração.

Fazer:

Adicionar os novos recursos de maneira nativa, discreta e organizada, seguindo exatamente o padrão visual já existente.

2. NOVO CONTROLE — APARÊNCIA

Adicionar um novo botão, seletor ou controle chamado:

Aparência

Esse controle deve permitir escolher o estilo visual da imagem que será gerada.

Opções:

3D Pixar

Anime

Arte Bíblica

Cartoon

Cinematográfico Dramático

Cinematográfico

Ilustração

Pintura Clássica

Realista

3. FUNCIONAMENTO DA APARÊNCIA

O objetivo é que o usuário consiga simplesmente selecionar uma aparência e gerar a imagem.

Exemplo:

Aparência: 3D Pixar

O sistema deverá gerar a imagem seguindo o modelo/referência visual correspondente a 3D Pixar.

Outro exemplo:

Aparência: Anime

O sistema deverá utilizar o modelo/referência visual correspondente a Anime.

O mesmo deve acontecer para todas as opções.

4. MODELOS DE APARÊNCIA

Eu fornecerei/inserirei os modelos, referências ou configurações correspondentes a cada aparência.

Portanto, crie a estrutura do código de forma organizada para que eu possa associar cada opção ao seu respectivo modelo.

Estrutura conceitual:

Aparência
│
├── 3D Pixar
├── Anime
├── Arte Bíblica
├── Cartoon
├── Cinematográfico Dramático
├── Cinematográfico
├── Ilustração
├── Pintura Clássica
└── Realista


Cada opção deverá possuir uma configuração própria que possa ser facilmente editada posteriormente.

IMPORTANTE

Não inventar modelos ou IDs de modelos que não foram fornecidos.

Criar apenas a estrutura necessária para receber os modelos/configurações que eu inserir.

5. REFERÊNCIAS VISUAIS DAS APARÊNCIAS

A interface pode utilizar uma lista, dropdown, cards ou seletor, desde que siga o design atual.

Se for possível dentro do design existente, cada aparência pode apresentar:

nome;

pequena imagem de referência;

estado selecionado.

Exemplo:

3D Pixar
[imagem de referência]

Anime
[imagem de referência]

Arte Bíblica
[imagem de referência]

Porém, não alterar o layout atual apenas para criar cards grandes.

A prioridade é manter a interface limpa e consistente.

6. COMO A APARÊNCIA DEVE SER APLICADA

Quando o usuário selecionar uma aparência, essa escolha deve ser utilizada como configuração adicional da geração.

Exemplo:

Prompt do usuário:

São Jorge montado em seu cavalo diante de uma igreja.

Aparência selecionada:

Arte Bíblica

O sistema deve gerar usando o prompt do usuário + a configuração correspondente à aparência selecionada.

IMPORTANTE

Não apagar, substituir ou reescrever o prompt original do usuário.

A aparência deve funcionar como uma configuração adicional.

7. PRIORIDADE DO PROMPT

A seleção de aparência não deve destruir o conteúdo escrito pelo usuário.

A estrutura lógica deve ser:

Prompt do usuário
+
Aparência selecionada
+
Outras configurações selecionadas

solicitação final enviada à API

Porém, sempre respeitando o formato real aceito pela API/modelo.

8. PROPORÇÃO

Adicionar um controle chamado:

Proporção

Opções:

Automático

16:9 (Horizontal)

9:16 (Vertical)

1:1 (Quadrado)

4:5 (Retrato)

Comportamento

Automático deve utilizar a proporção padrão ou automática suportada pela API/modelo.

As outras opções devem ser utilizadas somente quando forem compatíveis com a API.

Não enviar parâmetros inexistentes.

9. RESOLUÇÃO

Adicionar um controle chamado:

Resolução

Opções:

Automático

720p HD — 1280 × 720

480p — 854 × 480

1080p Full HD — 1920 × 1080

Utilizar somente resoluções suportadas pela API/modelo atual.

Se a API utilizar outro sistema de definição de resolução, fazer a conversão internamente.

Não inventar parâmetros.

10. QUALIDADE DA IMAGEM

Adicionar:

Qualidade da imagem

Opções:

Rápida

Prioriza rapidez quando a API oferecer essa possibilidade.

Alta

Prioriza uma configuração de qualidade superior quando suportada.

Máxima

Utiliza a maior qualidade disponível, podendo aumentar tempo ou custo.

Se a API não oferecer controle de qualidade, não inventar parâmetros.

11. ENQUADRAMENTO

Adicionar:

Enquadramento

Opções:

Plano aberto

Mostra personagem e cenário.

Plano médio

Mostra o personagem da cintura para cima.

Close-up

Destaca o rosto.

Corpo inteiro

Mostra o personagem completo.

Vista aérea

Cena vista de cima.

Perfil

Personagem visto de lado.

Composição central

Personagem centralizado na composição.

Cada opção deve possuir uma explicação curta na interface, preferencialmente através de descrição, tooltip ou texto secundário.

12. 🧍 PERSONAGEM

Dentro da seção:

Adicionais

Adicionar:

🧍 Personagem

Ao clicar, expandir:

Imagem de referência

Imagem de referência — Opcional

Permitir upload de uma imagem.

A imagem somente deve ser enviada à API se a API/modelo atual realmente suportar referência de imagem.

Permitir:

selecionar;

visualizar;

substituir;

remover.

Manter personagem

Opções:

Sim

Não

Quando Sim, utilizar os recursos reais de consistência de personagem disponíveis na API.

Quando Não, não reutilizar a referência nas próximas gerações.

Não prometer consistência perfeita caso a API não ofereça esse recurso.

13. NÃO CRIAR CAMPOS EXTRAS DE PERSONAGEM

Não adicionar:

Nome;

Idade;

Sexo;

Altura;

Cabelo;

Cor dos olhos;

Roupa;

Pose;

Expressão;

Descrição;

Características físicas.

Apenas:

🧍 Personagem

→ Imagem de referência — Opcional

→ Manter personagem — Sim / Não

14. COMPATIBILIDADE COM A API

Esta é uma regra fundamental.

Antes de conectar qualquer recurso novo, verificar a API/modelo atualmente utilizado no projeto.

Utilizar somente parâmetros realmente aceitos.

Não inventar:

endpoints;

parâmetros;

modelos;

IDs;

formatos;

recursos de consistência;

controles de qualidade.

Se uma funcionalidade não for suportada, a interface pode permanecer preparada para ela, mas a aplicação não deve enviar dados inválidos.

15. FUNCIONAMENTO SEM CONFIGURAÇÕES

Todas as novas configurações devem ser opcionais.

Se o usuário simplesmente abrir o gerador e escrever um prompt, tudo deve continuar funcionando como anteriormente.

Nenhuma nova opção pode bloquear a geração normal.

16. ORGANIZAÇÃO DA INTERFACE

Adicionar os controles sem deixar a interface poluída.

A organização deve seguir o padrão visual atual.

Novos controles:

Aparência

Proporção

Resolução

Qualidade da imagem

Enquadramento

e:

Adicionais

→ 🧍 Personagem

A ordem pode ser ajustada para combinar com o layout atual, mas sem alterar a estrutura visual existente desnecessariamente.

17. APARÊNCIA — ESTRUTURA PREPARADA PARA OS MODELOS

Crie uma estrutura de configuração facilmente editável para que eu possa inserir posteriormente os modelos de cada aparência.

Exemplo conceitual:

const aparencias = {
    "3D Pixar": {
        modelo: "",
        configuracao: ""
    },

    "Anime": {
        modelo: "",
        configuracao: ""
    },

    "Arte Bíblica": {
        modelo: "",
        configuracao: ""
    },

    "Cartoon": {
        modelo: "",
        configuracao: ""
    },

    "Cinematográfico Dramático": {
        modelo: "",
        configuracao: ""
    },

    "Cinematográfico": {
        modelo: "",
        configuracao: ""
    },

    "Ilustração": {
        modelo: "",
        configuracao: ""
    },

    "Pintura Clássica": {
        modelo: "",
        configuracao: ""
    },

    "Realista": {
        modelo: "",
        configuracao: ""
    }
};


Use essa estrutura apenas como referência conceitual.

Adapte-a à arquitetura real do HTML e à API existente.

Não criar uma segunda arquitetura de geração.

18. EXPERIÊNCIA DO USUÁRIO

O fluxo desejado é:

Usuário escreve o prompt.

Escolhe uma Aparência.

Escolhe opcionalmente a Proporção.

Escolhe opcionalmente a Resolução.

Escolhe opcionalmente a Qualidade da imagem.

Escolhe opcionalmente o Enquadramento.

Abre Adicionais se quiser.

Escolhe 🧍 Personagem.

Opcionalmente adiciona uma imagem de referência.

Escolhe Manter personagem: Sim/Não.

Clica em CRIAR.

O sistema gera a imagem utilizando as configurações selecionadas e a API/modelo compatível.

19. PRESERVAÇÃO DO DESIGN

Todos os novos controles devem parecer que sempre fizeram parte do projeto.

Preservar exatamente:

identidade visual;

cores;

fonte;

tamanhos;

espaçamento;

bordas;

sombras;

ícones;

botões;

estados selecionados;

estados desativados;

modo escuro;

responsividade.

Não criar um visual diferente para os novos controles.

20. TESTE FINAL OBRIGATÓRIO

Antes de finalizar o código, verificar:

Gerador

O prompt original continua funcionando.

CRIAR continua funcionando.

EDITAR continua funcionando.

A API atual continua funcionando.

A chave da API continua funcionando.

Os resultados continuam aparecendo.

Download continua funcionando.

Novos controles

Aparência funciona.

Proporção funciona quando suportada.

Resolução funciona quando suportada.

Qualidade funciona quando suportada.

Enquadramento funciona.

Personagem abre corretamente.

Upload funciona quando suportado.

Manter personagem funciona quando suportado.

Compatibilidade

Nenhum parâmetro inválido deve ser enviado para a API.

Nenhum recurso inexistente deve ser simulado.

Nenhuma funcionalidade antiga deve ser removida.

21. RESULTADO FINAL

O resultado deve ser:

O MESMO GERADOR DE IMAGENS ATUAL + OS NOVOS CONTROLES.

Não quero um novo gerador.

Quero uma evolução do gerador existente.

A prioridade é:

1. Preservar o que já funciona.

2. Adicionar os novos controles.

3. Integrar somente o que a API realmente suporta.

4. Manter o design original.

5. Deixar a estrutura de Aparência preparada para receber os modelos que serão fornecidos.

6. Entregar um único HTML final funcional.

Faça a alteração diretamente no HTML fornecido e entregue o projeto finalizado, sem remover ou quebrar nenhuma funcionalidade existente.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://persona-pictoria-gen.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a0463639-289f-4212-bc01-7932c0e605e7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
