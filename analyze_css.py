#!/usr/bin/env python3
"""
Analisa styles.css e index.html para identificar regras CSS não utilizadas.
"""
import re
from pathlib import Path

def extract_css_selectors(css_content):
    """Extrai todos os seletores CSS (classes, IDs, elementos)."""
    # Remove comentários
    css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
    
    # Captura blocos de regras CSS (ignora @media, @keyframes, etc. por agora)
    # Padrão: captura tudo até { que não seja @ rule
    blocks = re.findall(r'([^{@}]+)\{', css_content)
    
    selectors = {
        'classes': set(),
        'ids': set(),
        'pseudo_classes': set(),
        'element_selectors': set()
    }
    
    for block in blocks:
        # Limpa e separa múltiplos seletores (ex: .a, .b, .c)
        parts = [s.strip() for s in block.split(',')]
        
        for selector in parts:
            if not selector:
                continue
            
            # Extrai classes (.classname)
            classes = re.findall(r'\.([a-zA-Z0-9_-]+)', selector)
            selectors['classes'].update(classes)
            
            # Extrai IDs (#id)
            ids = re.findall(r'#([a-zA-Z0-9_-]+)', selector)
            selectors['ids'].update(ids)
            
            # Extrai pseudo-classes (:hover, :focus, etc.)
            pseudo = re.findall(r':([a-zA-Z0-9_-]+)', selector)
            selectors['pseudo_classes'].update(pseudo)
    
    return selectors

def extract_html_tokens(html_content):
    """Extrai classes, IDs e elementos usados no HTML."""
    tokens = {
        'classes': set(),
        'ids': set(),
        'elements': set()
    }
    
    # Classes: class="..."
    classes = re.findall(r'class=["\']([^"\']+)["\']', html_content)
    for cls in classes:
        # Múltiplas classes separadas por espaço
        tokens['classes'].update(cls.strip().split())
    
    # IDs: id="..."
    ids = re.findall(r'id=["\']([^"\']+)["\']', html_content)
    tokens['ids'].update(ids)
    
    # Tags HTML (elementos)
    elements = re.findall(r'<([a-z][a-z0-9]*)', html_content, re.IGNORECASE)
    tokens['elements'].update(elements)
    
    return tokens

def find_unused_css(css_selectors, html_tokens):
    """Compara e retorna seletores CSS não usados no HTML."""
    unused = {
        'classes': css_selectors['classes'] - html_tokens['classes'],
        'ids': css_selectors['ids'] - html_tokens['ids']
    }
    return unused

def main():
    base_path = Path(__file__).parent
    css_path = base_path / 'styles.css'
    html_path = base_path / 'index.html'
    
    # Lê arquivos
    css_content = css_path.read_text(encoding='utf-8')
    html_content = html_path.read_text(encoding='utf-8')
    
    # Extrai seletores e tokens
    css_selectors = extract_css_selectors(css_content)
    html_tokens = extract_html_tokens(html_content)
    
    # Encontra não usados
    unused = find_unused_css(css_selectors, html_tokens)
    
    # Relatório
    print("=" * 70)
    print("ANÁLISE DE CSS NÃO UTILIZADO")
    print("=" * 70)
    print()
    
    if unused['classes']:
        print(f"⚠️  CLASSES CSS NÃO USADAS NO HTML ({len(unused['classes'])})")
        print("-" * 70)
        for cls in sorted(unused['classes']):
            print(f"  .{cls}")
        print()
    else:
        print("✅ Todas as classes CSS estão sendo usadas!")
        print()
    
    if unused['ids']:
        print(f"⚠️  IDs CSS NÃO USADOS NO HTML ({len(unused['ids'])})")
        print("-" * 70)
        for id_sel in sorted(unused['ids']):
            print(f"  #{id_sel}")
        print()
    else:
        print("✅ Todos os IDs CSS estão sendo usados!")
        print()
    
    # Estatísticas
    print("=" * 70)
    print("ESTATÍSTICAS")
    print("=" * 70)
    print(f"Total de classes no CSS: {len(css_selectors['classes'])}")
    print(f"Total de classes no HTML: {len(html_tokens['classes'])}")
    print(f"Classes não usadas: {len(unused['classes'])}")
    print()
    print(f"Total de IDs no CSS: {len(css_selectors['ids'])}")
    print(f"Total de IDs no HTML: {len(html_tokens['ids'])}")
    print(f"IDs não usados: {len(unused['ids'])}")
    print()
    
    # Taxa de uso
    if css_selectors['classes']:
        usage_rate = (1 - len(unused['classes']) / len(css_selectors['classes'])) * 100
        print(f"Taxa de uso de classes: {usage_rate:.1f}%")
    
    if css_selectors['ids']:
        id_usage_rate = (1 - len(unused['ids']) / len(css_selectors['ids'])) * 100
        print(f"Taxa de uso de IDs: {id_usage_rate:.1f}%")
    
    print()
    print("=" * 70)
    
    # Nota importante
    print()
    print("📝 NOTA:")
    print("   - Pseudo-classes (:hover, :focus) e estados dinâmicos NÃO são")
    print("     marcados como não usados (são aplicados em runtime).")
    print("   - Classes adicionadas via JavaScript podem aparecer como não usadas.")
    print("   - Media queries e seletores complexos foram simplificados na análise.")
    print()

if __name__ == '__main__':
    main()
