declare module 'markdown-contents' {
  export interface Article {
    level: number
    id: string
    name: string
  }

  export interface TreeNode extends Article {
    descendants: TreeNode[]
  }

  export interface MarkdownContents {
    articles (): Article[]
    tree (): TreeNode[]
  }
  
  export interface CreateMarkdownContents {
    (markdown: string): MarkdownContents
  }

  const createMarkdownContents: CreateMarkdownContents
  export default createMarkdownContents
}