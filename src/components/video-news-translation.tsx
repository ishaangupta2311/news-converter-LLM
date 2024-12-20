import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {Video} from 'lucide-react'


export const VideoNewsTranslation = ({ handleOptionFunc }: { handleOptionFunc: (option: string) => void }) => {

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleOptionFunc('video')}>
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <Video className="h-8 w-8 mr-2 text-blue-600" />
            Translate News Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Generate multilingual subtitles for news videos
        </CardDescription>
      </CardContent>
    </Card>
  )
}

