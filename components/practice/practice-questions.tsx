"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, CheckCircle, Clock, ArrowRight, Code, BookOpen } from "lucide-react"

type Question = {
  id: string
  title: string
  difficulty: string
  category: string
  description: string
  constraints: string[]
  examples: {
    input: string
    output: string
    explanation?: string
  }[]
  hints: string[]
  solution: string
}

export function PracticeQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const demoQuestions = [
      {
        id: "q1",
        title: "Two Sum",
        difficulty: "easy",
        category: "arrays",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists.",
        ],
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
          },
        ],
        hints: [
          "Try using a hash map to store the values you've seen so far.",
          "For each number, check if target - number exists in the hash map.",
        ],
        solution:
          "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      },
      {
        id: "q2",
        title: "Valid Parentheses",
        difficulty: "easy",
        category: "stacks",
        description:
          "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
        examples: [
          {
            input: 's = "()"',
            output: "true",
          },
          {
            input: 's = "()[]{}"',
            output: "true",
          },
          {
            input: 's = "(]"',
            output: "false",
          },
        ],
        hints: [
          "Use a stack to keep track of opening brackets.",
          "When you encounter a closing bracket, check if it matches the most recent opening bracket.",
        ],
        solution:
          "function isValid(s) {\n  const stack = [];\n  const map = {\n    '(': ')',\n    '[': ']',\n    '{': '}'\n  };\n  \n  for (let i = 0; i < s.length; i++) {\n    if (s[i] in map) {\n      stack.push(s[i]);\n    } else {\n      const last = stack.pop();\n      if (map[last] !== s[i]) return false;\n    }\n  }\n  \n  return stack.length === 0;\n}",
      },
      {
        id: "q3",
        title: "Merge Two Sorted Lists",
        difficulty: "easy",
        category: "linked lists",
        description: "Merge two sorted linked lists and return it as a sorted list.",
        constraints: [
          "The number of nodes in both lists is in the range [0, 50].",
          "-100 <= Node.val <= 100",
          "Both l1 and l2 are sorted in non-decreasing order.",
        ],
        examples: [
          {
            input: "l1 = [1,2,4], l2 = [1,3,4]",
            output: "[1,1,2,3,4,4]",
          },
          {
            input: "l1 = [], l2 = []",
            output: "[]",
          },
        ],
        hints: [
          "Use a dummy head to simplify the code.",
          "Compare the values of the two lists and link the smaller one to the result.",
        ],
        solution:
          "function mergeTwoLists(l1, l2) {\n  const dummy = new ListNode(0);\n  let current = dummy;\n  \n  while (l1 && l2) {\n    if (l1.val < l2.val) {\n      current.next = l1;\n      l1 = l1.next;\n    } else {\n      current.next = l2;\n      l2 = l2.next;\n    }\n    current = current.next;\n  }\n  \n  current.next = l1 || l2;\n  \n  return dummy.next;\n}",
      },
      {
        id: "q4",
        title: "Maximum Subarray",
        difficulty: "medium",
        category: "dynamic programming",
        description:
          "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
        constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        examples: [
          {
            input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
            output: "6",
            explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
          },
          {
            input: "nums = [1]",
            output: "1",
          },
        ],
        hints: ["Use Kadane's algorithm.", "Keep track of the current sum and the maximum sum seen so far."],
        solution:
          "function maxSubArray(nums) {\n  let currentSum = nums[0];\n  let maxSum = nums[0];\n  \n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  \n  return maxSum;\n}",
      },
      {
        id: "q5",
        title: "Longest Palindromic Substring",
        difficulty: "medium",
        category: "strings",
        description: "Given a string s, return the longest palindromic substring in s.",
        constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters."],
        examples: [
          {
            input: 's = "babad"',
            output: '"bab"',
            explanation: '"aba" is also a valid answer.',
          },
          {
            input: 's = "cbbd"',
            output: '"bb"',
          },
        ],
        hints: ["Try expanding around the center for each position.", "Consider both odd and even length palindromes."],
        solution:
          'function longestPalindrome(s) {\n  if (!s || s.length < 1) return "";\n  \n  let start = 0;\n  let end = 0;\n  \n  for (let i = 0; i < s.length; i++) {\n    const len1 = expandAroundCenter(s, i, i);\n    const len2 = expandAroundCenter(s, i, i + 1);\n    const len = Math.max(len1, len2);\n    \n    if (len > end - start) {\n      start = i - Math.floor((len - 1) / 2);\n      end = i + Math.floor(len / 2);\n    }\n  }\n  \n  return s.substring(start, end + 1);\n}\n\nfunction expandAroundCenter(s, left, right) {\n  while (left >= 0 && right < s.length && s[left] === s[right]) {\n    left--;\n    right++;\n  }\n  \n  return right - left - 1;\n}',
      },
      {
        id: "q6",
        title: "LRU Cache",
        difficulty: "hard",
        category: "design",
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
        constraints: [
          "1 <= capacity <= 3000",
          "0 <= key <= 10^4",
          "0 <= value <= 10^5",
          "At most 2 * 10^5 calls will be made to get and put.",
        ],
        examples: [
          {
            input:
              "LRUCache lRUCache = new LRUCache(2); lRUCache.put(1, 1); lRUCache.put(2, 2); lRUCache.get(1); lRUCache.put(3, 3); lRUCache.get(2); lRUCache.put(4, 4); lRUCache.get(1); lRUCache.get(3); lRUCache.get(4);",
            output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
          },
        ],
        hints: [
          "Use a hash map and a doubly linked list.",
          "The hash map gives O(1) access to cache nodes, and the linked list helps maintain the order.",
        ],
        solution:
          "class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    \n    const value = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    return value;\n  }\n\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const firstKey = this.cache.keys().next().value;\n      this.cache.delete(firstKey);\n    }\n    \n    this.cache.set(key, value);\n  }\n}",
      },
    ]

    setQuestions(demoQuestions)
    setFilteredQuestions(demoQuestions)

    // Extract unique categories
    const uniqueCategories = Array.from(new Set(demoQuestions.map((q) => q.category)))
    setCategories(uniqueCategories)

    setIsLoading(false)
  }, [])

  useEffect(() => {
    let filtered = [...questions]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.category.toLowerCase().includes(query) ||
          q.description.toLowerCase().includes(query),
      )
    }

    // Apply difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter((q) => q.difficulty === selectedDifficulty)
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((q) => q.category === selectedCategory)
    }

    setFilteredQuestions(filtered)
  }, [searchQuery, selectedDifficulty, selectedCategory, questions])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading questions...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search questions..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedDifficulty === "easy" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("easy")}
            className="whitespace-nowrap"
          >
            Easy
          </Button>
          <Button
            variant={selectedDifficulty === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("medium")}
            className="whitespace-nowrap"
          >
            Medium
          </Button>
          <Button
            variant={selectedDifficulty === "hard" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("hard")}
            className="whitespace-nowrap"
          >
            Hard
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="bg-muted/50 flex gap-1 items-center">
          <Filter className="h-3 w-3" />
          Categories:
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer capitalize"
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{question.title}</CardTitle>
                <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
              </div>
              <CardDescription className="capitalize">{question.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm line-clamp-3">{question.description}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={() => handleQuestionSelect(question)}>
                    View Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  {selectedQuestion && (
                    <>
                      <DialogHeader>
                        <div className="flex justify-between items-center">
                          <DialogTitle>{selectedQuestion.title}</DialogTitle>
                          <Badge className={getDifficultyColor(selectedQuestion.difficulty)}>
                            {selectedQuestion.difficulty}
                          </Badge>
                        </div>
                        <DialogDescription className="capitalize">{selectedQuestion.category}</DialogDescription>
                      </DialogHeader>

                      <Tabs defaultValue="description">
                        <TabsList className="grid grid-cols-3 w-full">
                          <TabsTrigger value="description">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Description
                          </TabsTrigger>
                          <TabsTrigger value="hints">
                            <Clock className="h-4 w-4 mr-2" />
                            Hints
                          </TabsTrigger>
                          <TabsTrigger value="solution">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Solution
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="space-y-4 mt-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Problem:</h4>
                            <p>{selectedQuestion.description}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Constraints:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {selectedQuestion.constraints.map((constraint, i) => (
                                <li key={i} className="text-sm">
                                  {constraint}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Examples:</h4>
                            {selectedQuestion.examples.map((example, i) => (
                              <div key={i} className="mb-4 p-3 bg-muted rounded-md">
                                <div className="mb-2">
                                  <span className="font-medium">Input:</span> {example.input}
                                </div>
                                <div className="mb-2">
                                  <span className="font-medium">Output:</span> {example.output}
                                </div>
                                {example.explanation && (
                                  <div>
                                    <span className="font-medium">Explanation:</span> {example.explanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="hints" className="space-y-4 mt-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Hints:</h4>
                            <ul className="list-disc pl-5 space-y-2">
                              {selectedQuestion.hints.map((hint, i) => (
                                <li key={i}>{hint}</li>
                              ))}
                            </ul>
                          </div>
                        </TabsContent>

                        <TabsContent value="solution" className="space-y-4 mt-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Solution:</h4>
                            <div className="bg-muted p-4 rounded-md overflow-x-auto">
                              <pre className="text-sm font-mono whitespace-pre-wrap">{selectedQuestion.solution}</pre>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <DialogFooter>
                        <Button>
                          <Code className="h-4 w-4 mr-2" />
                          Solve in Code Editor
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium">No questions found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  )
}

