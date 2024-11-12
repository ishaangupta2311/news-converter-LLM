import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Newspaper } from "lucide-react"


export const ArticleNewsTranslation = ({ handleOptionFunc }: { handleOptionFunc: (option: string) => void }) => {

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleOptionFunc('article')}>
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <Newspaper className="h-8 w-8 mr-2 text-blue-600" />
          Translate News Article
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>Convert written news articles into multiple languages</CardDescription>
      </CardContent>
    </Card>
  )
}
