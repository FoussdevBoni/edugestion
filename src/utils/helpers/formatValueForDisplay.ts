export   const formatValue = (val: string | number): string => {
    const str = typeof val === 'string' ? val : val.toString();
    
    // Si c'est une devise formatée (contient €, $, XOF, etc.)
    if (typeof val === 'string' && /[€$£¥₩₹₽₺]|XOF|FCFA/.test(val)) {
      return str;
    }
    
    // Pour les très grands nombres, utiliser la notation scientifique
    const num = typeof val === 'string' ? parseFloat(str.replace(/[^\d.-]/g, '')) : val;
    if (Math.abs(num) >= 1e12) {
      return `${(num / 1e12).toFixed(2)}T`;
    }
    if (Math.abs(num) >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`;
    }
    if (Math.abs(num) >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`;
    }
    if (Math.abs(num) >= 1e3) {
      return `${(num / 1e3).toFixed(1)}K`;
    }
    
    return str;
  };