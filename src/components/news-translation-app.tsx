'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {VideoNewsTranslation} from './video-news-translation'
import { ArticleNewsTranslation } from './news-article-translation'
import Navbar from './Navbar'
import { Footer } from './Footer'

export function NewsTranslationAppComponent() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [url, setUrl] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [translationProgress, setTranslationProgress] = useState(0)
  const [translationResults, setTranslationResults] = useState<Record<string, string> | null>(null)

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    setUrl('')
    setSelectedLanguages([])
    setTranslationProgress(0)
    setTranslationResults(null)
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Selected Languages List:", selectedLanguages)

    try {
      const response = await fetch('/ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, languages: selectedLanguages }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch translation')
      }

      setTranslationResults(data.model_response)
      setTranslationProgress(100)
    } catch (error) {
      console.error('Error during translation:', error)
      setTranslationProgress(0)
    }
  }

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguages(prev => {
      const newSelectedLanguages = prev.includes(lang) 
        ? prev.filter(l => l !== lang) 
        : [...prev, lang];
      
      return newSelectedLanguages;
    });
  }

  // console.log('Translation Results:', translationResults);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar/>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedOption ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Translate News Content</h1>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <ArticleNewsTranslation handleOptionFunc={handleOptionSelect}/>
              <VideoNewsTranslation handleOptionFunc={handleOptionSelect}/>          
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => setSelectedOption(null)} className="mb-4">
              &larr; Back to options
            </Button>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Translate News {selectedOption === 'article' ? 'Article' : 'Video'}
            </h2>
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter URL
                </label>
                <Input
                  id="url"
                  type="url"
                  placeholder={`https://example.com/${selectedOption === 'article' ? 'news-article' : 'news-video'}`}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Target Languages
                </label>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  {['Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese', 'Korean', 'Russian', 'Portuguese', 'Arabic', 'Hindi', 'Bengali'].map((lang) => (
                    <div key={lang} className="flex items-center py-1 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`lang-${lang}`}
                        checked={selectedLanguages.includes(lang)}
                        onChange={() => handleLanguageSelect(lang)}
                        className="mr-2"
                      />
                      <label htmlFor={`lang-${lang}`} className="text-sm text-gray-700">
                        {lang}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Start Translation
              </Button>
            </form>
            {translationProgress > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Translation Progress</h3>
                <Progress value={translationProgress} className="w-full" />
              </div>
            )}
            {translationProgress === 100 && translationResults && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Translation Results</h3>
                <Tabs defaultValue="original" className="w-full">
                  <TabsList>
                    <TabsTrigger value="original">Original</TabsTrigger>
                    {selectedLanguages.map((lang) => (
                      <TabsTrigger key={lang} value={lang}>{lang}</TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="original" className="p-4 bg-white rounded-md shadow">
                    <p className="text-gray-600">Original content will be displayed here.</p>
                  </TabsContent>
                  {selectedLanguages.map((lang) => (
                    <TabsContent key={lang} value={lang} className="p-4 bg-white rounded-md shadow">
                      <p className="text-gray-600">
                        {translationResults && translationResults[lang.toLowerCase()]
                          ? translationResults[lang.toLowerCase()]
                          : `Translation not available for ${lang}`
                        }
                      </p>
                    </TabsContent>
                  ))}
                </Tabs>
                
              </div>
              
            )}
          </div>
        )}
      </main>

      <Footer/>
    </div>
  )
}