import jss, { StyleSheetFactoryOptions } from 'jss'
import preset from 'jss-preset-default'
import { Styles } from '@material-ui/styles'

jss.setup(preset())

export default function <ClassNamePrefix extends string, T extends Record<string, object>>(
  classNamePrefix: ClassNamePrefix, 
  styles: T | Styles<T, {}>,
  options?: StyleSheetFactoryOptions
): Record<keyof T, string>{
  return jss.createStyleSheet(styles, { classNamePrefix: classNamePrefix + '-', ...options }).attach().classes as any
}