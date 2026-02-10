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

export const fromPrimeIcon = (primeIcon: string): IIcon => {
  if (!primeIcon.startsWith('pi-')) {
    primeIcon = 'pi-' + primeIcon;
  }

  if (!primeIcon.startsWith('pi ')) {
    primeIcon = 'pi ' + primeIcon;
  }
  return {
    iconClass: primeIcon,
  };
}