'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {VideoNewsTranslation} from './video-news-translation'
import { ArticleNewsTranslation } from './news-article-translation'
import Navbar from './Navbar'

export function NewsTranslationAppComponent() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [url, setUrl] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [translationProgress, setTranslationProgress] = useState(0)

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    // Reset other states when changing option
    setUrl('')
    setSelectedLanguages([])
    setTranslationProgress(0)
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate translation process
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setTranslationProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 500)
  }

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    )
  }

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
                <div className="border rounded-md p-3 space-y-2">
                  {['Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese'].map((lang) => (
                    <div key={lang} className="flex items-center">
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
            {translationProgress === 100 && (
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
                      <p className="text-gray-600">Translated content for {lang} will be displayed here.</p>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">&copy; 2023 NewsTranslator. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}