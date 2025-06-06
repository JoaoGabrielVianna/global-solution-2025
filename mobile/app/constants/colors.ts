const LightTheme = {
    // Cores principais baseadas na paleta especificada
    primary: '#4C5A41',        // Verde-oliva escuro (títulos, ícones principais, botões)
    secondary: '#9AA77C',      // Verde-musgo claro (fundo de ícones, áreas secundárias)
    accent: '#C07F55',         // Terracota suave (destaques, alertas visuais, ícones de risco)
    background: '#F5EFE5',     // Bege claro (fundo geral da tela, splash screen)
    text: '#3E4C3B',          // Cinza-esverdeado escuro (texto primário, menus e bordas)
    
    // Variações e complementares
    primaryLight: '#6B7A5D',   // Verde-oliva mais claro
    secondaryDark: '#7A8B5F',  // Verde-musgo mais escuro
    accentLight: '#D4967A',    // Terracota mais claro
    backgroundDark: '#EDE4D5', // Bege mais escuro
    textLight: '#5A6B57',      // Cinza-esverdeado mais claro
    
    // Estados e feedback
    success: '#6B8E23',        // Verde para sucesso
    warning: '#DAA520',        // Amarelo-dourado para avisos
    danger: '#CD5C5C',         // Vermelho suave para perigo
    info: '#4682B4',           // Azul aço para informações
    
    // Elementos de interface
    white: '#FFFFFF',
    shadow: 'rgba(62, 76, 59, 0.1)',
    border: 'rgba(62, 76, 59, 0.2)',
    placeholder: 'rgba(62, 76, 59, 0.5)',
  };
  
  const DarkTheme = {
    // Adaptação para modo escuro
    primary: '#9AA77C',        // Verde-musgo claro como primário
    secondary: '#4C5A41',      // Verde-oliva escuro como secundário
    accent: '#C07F55',         // Terracota mantém-se
    background: '#2C3328',     // Fundo escuro esverdeado
    text: '#F5EFE5',          // Bege claro para texto
    
    // Variações e complementares
    primaryLight: '#B4C490',   
    secondaryDark: '#3A4537',  
    accentLight: '#D4967A',    
    backgroundDark: '#1F251C', 
    textLight: '#D1C7B8',      
    
    // Estados e feedback
    success: '#8FBC8F',        
    warning: '#F0E68C',        
    danger: '#F08080',         
    info: '#87CEEB',           
    
    // Elementos de interface
    white: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.3)',
    border: 'rgba(245, 239, 229, 0.2)',
    placeholder: 'rgba(245, 239, 229, 0.5)',
  };
  
  export const COLORS = LightTheme;