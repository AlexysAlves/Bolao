# Bolão Copa do Mundo 2026 – Google Apps Script

Este repositório contém o código em **Google Apps Script** usado para automatizar a classificação dos grupos, o cálculo dos melhores terceiros colocados e a atualização do chaveamento do bolão da Copa do Mundo de 2026 em uma planilha do Google Sheets.

## 📌 Funcionalidades

- Ordenação automática da classificação de cada grupo (pontos, saldo de gols e gols marcados)
- Identificação e ranqueamento dos terceiros colocados
- Atualização automática dos confrontos do mata-mata

## 🛠️ Tecnologias

- Google Sheets
- Google Apps Script (JavaScript)

## 🚀 Como usar

1. Faça uma cópia da planilha modelo do bolão
2. Abra a planilha copiada
3. Vá em **Extensões → Apps Script**
4. Cole o código deste repositório
5. Salve o projeto

### Criar o gatilho de edição (obrigatório)
Execute **uma única vez**, como proprietário da planilha:

```javascript
criarTriggerOnEdit();
