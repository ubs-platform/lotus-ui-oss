import { PI_TO_MATERIAL_MAP, MATERIAL_FALLBACK } from './pi-to-material-map';

export interface IIcon {
  iconClass?: string;
  iconContent?: string;
  iconImageSource?: string;
}

export const fromMaterialSymbol = (iconContent: string): IIcon => {
  return {
    iconClass: 'material-symbols-outlined',
    iconContent: iconContent,
  };
}

/**
 * @deprecated Use fromMaterialSymbol() instead. This function now internally
 * converts PrimeIcon names to Material Symbols equivalents.
 */
export const fromPrimeIcon = (primeIcon: string): IIcon => {
  // Normalize: extract the pi-xxx part
  const match = primeIcon.match(/pi-([\w-]+)/);
  if (match) {
    const piName = 'pi-' + match[1];
    const materialName = PI_TO_MATERIAL_MAP[piName] || MATERIAL_FALLBACK;
    return fromMaterialSymbol(materialName);
  }
  return fromMaterialSymbol(MATERIAL_FALLBACK);
}