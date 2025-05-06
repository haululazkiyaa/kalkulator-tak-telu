"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface TAKRecord {
  id: number;
  student_id: string;
  nama_kegiatan: string;
  nama_kegiatan_english: string;
  point: number;
  nama_kategori: string;
  nama_jenis_kegiatan: string | null;
  tingkat: string;
  partisipasi: string;
  approved_status: string;
  student_name: string;
}

interface CategoryRequirement {
  name: string;
  minPoints: number;
  currentPoints: number;
  activities: TAKRecord[];
  isFulfilled: boolean;
}

export default function Home() {
  const [takData, setTakData] = useState<TAKRecord[]>([]);
  const [categoryRequirements, setCategoryRequirements] = useState<
    CategoryRequirement[]
  >([]);
  const [otherActivities, setOtherActivities] = useState<TAKRecord[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [requiredPoints, setRequiredPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleJsonInput = (jsonText: string) => {
    setIsLoading(true);
    try {
      const data = JSON.parse(jsonText);
      setTakData(data);
      processData(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      alert("Error parsing JSON. Pastikan format JSON valid.");
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (data: TAKRecord[]) => {
    // Filter only approved activities
    const approvedActivities = data.filter(
      (activity) => activity.approved_status === "Y"
    );

    // Define category requirements
    const requirements = [
      {
        name: "Orientasi Mahasiswa Baru",
        minPoints: 6,
        key: "Orientasi Mahasiswa Baru",
      },
      { name: "Self Management", minPoints: 2, key: "Self Management" },
      {
        name: "Relationship Management",
        minPoints: 2,
        key: "Relationship Management",
      },
      { name: "Leadership", minPoints: 2, key: "Leadership" },
      {
        name: "Entrepreneur Mindset",
        minPoints: 2,
        key: "Enterepreneur Mindset",
      },
      {
        name: "Pencegahan Kekerasan Seksual dan Perundungan",
        minPoints: 2,
        key: "Pencegahan Kekerasan Seksual dan Perundungan",
      },
      { name: "Anti NAPZA", minPoints: 2, key: "Anti NAPZA" },
      { name: "Anti Korupsi", minPoints: 2, key: "Anti Korupsi" },
      { name: "Anti Radikalisme", minPoints: 2, key: "Anti Radikalisme" },
      { name: "Green Campus", minPoints: 2, key: "Green Campus" },
      { name: "Belmawa/Mandiri", minPoints: 6, key: "Kompetisi " },
      { name: "Psikotes", minPoints: 2, key: "Psikotes" },
      {
        name: "Career Preparation Training 1 (Soft Skill)",
        minPoints: 2,
        key: "Career Preparation Training 1 (Soft Skill)",
      },
      {
        name: "Career Preoaration Training 2 (Industrial Seminar)",
        minPoints: 2,
        key: "Career Preoaration Training 2 (Industrial Seminar)",
      },
      {
        name: "Organisasi Kemahasiswaan",
        minPoints: 8,
        key: "Organisasi Kemahasiswaan",
      },
    ];

    let totalRequiredPoints = 0;
    requirements.forEach((req) => {
      totalRequiredPoints += req.minPoints;
    });
    setRequiredPoints(totalRequiredPoints);

    // Process each category
    const processedCategories: CategoryRequirement[] = [];
    let otherActivitiesPoints = 0;
    const otherActivitiesList: TAKRecord[] = [];

    requirements.forEach((req) => {
      let categoryActivities: TAKRecord[] = [];
      let categoryPoints = 0;

      if (req.name === "Orientasi Mahasiswa Baru") {
        categoryActivities = approvedActivities.filter(
          (activity) => activity.partisipasi.toLowerCase(); === req.key.toLowerCase();
        );
      } else if (req.name === "Belmawa/Mandiri") {
        categoryActivities = approvedActivities.filter((activity) =>
          activity.nama_jenis_kegiatan?.includes(req.key)
        );
      } else if (req.name === "Organisasi Kemahasiswaan") {
        categoryActivities = approvedActivities.filter(
          (activity) => activity.tingkat.toLowerCase(); === req.key.toLowerCase();
        );
      } else {
        categoryActivities = approvedActivities.filter(
          (activity) => activity.partisipasi.toLowerCase(); === req.key.toLowerCase();
        );
      }

      categoryPoints = categoryActivities.reduce(
        (sum, activity) => sum + activity.point,
        0
      );

      processedCategories.push({
        name: req.name,
        minPoints: req.minPoints,
        currentPoints: categoryPoints,
        activities: categoryActivities,
        isFulfilled: categoryPoints >= req.minPoints,
      });
    });

    // Find activities that don't belong to any specific category
    const categorizedActivityIds = new Set();
    processedCategories.forEach((category) => {
      category.activities.forEach((activity) => {
        categorizedActivityIds.add(activity.id);
      });
    });

    approvedActivities.forEach((activity) => {
      if (!categorizedActivityIds.has(activity.id)) {
        otherActivitiesList.push(activity);
        otherActivitiesPoints += activity.point;
      }
    });

    setOtherActivities(otherActivitiesList);
    setCategoryRequirements(processedCategories);

    // Calculate total points
    const totalPointsEarned = approvedActivities.reduce(
      (sum, activity) => sum + activity.point,
      0
    );
    setTotalPoints(totalPointsEarned);
  };

  // Process sample data on initial load for demonstration
  useEffect(() => {
    if (takData.length > 0) {
      processData(takData);
    }
  }, [takData]);

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-end items-center">
            <a href="https://github.com/haululazkiyaa/kalkulator-tak-telu">
              https://github.com/haululazkiyaa/kalkulator-tak-telu
            </a>
          </div>
          <CardTitle className="text-2xl">
            KATAK - Kalkulator TAK Tel-U (Transkrip Aktivitas Kemahasiswaan)
          </CardTitle>
          <CardDescription>
            Unggah file JSON data TAK untuk melihat perhitungan dan kategorisasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="json-input" className="text-sm font-medium">
                Tempel data JSON TAK di sini:
              </label>
              <textarea
                id="json-input"
                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder='[{"id": 1, "nama_kegiatan": "Contoh Kegiatan", ...}]'
                disabled={isLoading}
              ></textarea>
            </div>
            <Button
              onClick={() => {
                const textarea = document.getElementById(
                  "json-input"
                ) as HTMLTextAreaElement;
                handleJsonInput(textarea.value);
              }}
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Proses Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {takData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Poin TAK</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalPoints}</div>
                <p className="text-sm text-muted-foreground">
                  dari {requiredPoints} poin minimum
                </p>
                <Progress
                  value={
                    totalPoints > requiredPoints
                      ? 100
                      : (totalPoints / requiredPoints) * 100
                  }
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Kategori Terpenuhi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {categoryRequirements.filter((cat) => cat.isFulfilled).length}
                  /{categoryRequirements.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  kategori telah memenuhi syarat minimum
                </p>
                <Progress
                  value={
                    (categoryRequirements.filter((cat) => cat.isFulfilled)
                      .length /
                      categoryRequirements.length) *
                    100
                  }
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Kegiatan Pilihan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {otherActivities.reduce(
                    (sum, activity) => sum + activity.point,
                    0
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  dari 18 poin minimum
                </p>
                <Progress
                  value={
                    (otherActivities.reduce(
                      (sum, activity) => sum + activity.point,
                      0
                    ) /
                      18) *
                    100
                  }
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="categories">
            <TabsList className="mb-4">
              <TabsTrigger value="categories">Kategori TAK</TabsTrigger>
              <TabsTrigger value="other">Kegiatan Pilihan</TabsTrigger>
              <TabsTrigger value="all">Semua Kegiatan</TabsTrigger>
            </TabsList>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryRequirements.map((category, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {category.name}
                        </CardTitle>
                        {category.isFulfilled ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Terpenuhi
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Belum Terpenuhi
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {category.currentPoints} dari {category.minPoints} poin
                        minimum
                      </CardDescription>
                      <Progress
                        value={
                          (category.currentPoints / category.minPoints) * 100
                        }
                        className="h-1.5 mt-1"
                      />
                    </CardHeader>
                    <CardContent className="pb-4">
                      {category.activities.length > 0 ? (
                        <ScrollArea className="h-40">
                          {category.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="mb-2">
                              <div className="font-medium">
                                {activity.nama_kegiatan}
                              </div>
                              <div className="text-sm text-muted-foreground flex justify-between">
                                <span>{activity.partisipasi}</span>
                                <span>{activity.point} poin</span>
                              </div>
                              {actIndex < category.activities.length - 1 && (
                                <Separator className="my-2" />
                              )}
                            </div>
                          ))}
                        </ScrollArea>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Tidak ada kegiatan
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="other">
              <Card>
                <CardHeader>
                  <CardTitle>Kegiatan Pilihan Selain Kegiatan Wajib</CardTitle>
                  <CardDescription>
                    {otherActivities.reduce(
                      (sum, activity) => sum + activity.point,
                      0
                    )}{" "}
                    dari 18 poin minimum
                  </CardDescription>
                  <Progress
                    value={
                      (otherActivities.reduce(
                        (sum, activity) => sum + activity.point,
                        0
                      ) /
                        18) *
                      100
                    }
                    className="h-2 mt-2"
                  />
                </CardHeader>
                <CardContent>
                  {otherActivities.length > 0 ? (
                    <ScrollArea className="h-96">
                      {otherActivities.map((activity, index) => (
                        <div key={index} className="mb-3">
                          <div className="font-medium">
                            {activity.nama_kegiatan}
                          </div>
                          <div className="text-sm text-muted-foreground flex justify-between">
                            <span>
                              {activity.nama_kategori} - {activity.partisipasi}
                            </span>
                            <span>{activity.point} poin</span>
                          </div>
                          {index < otherActivities.length - 1 && (
                            <Separator className="my-2" />
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Tidak ada kegiatan pilihan
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Semua Kegiatan TAK</CardTitle>
                  <CardDescription>
                    Total{" "}
                    {
                      takData.filter(
                        (activity) => activity.approved_status === "Y"
                      ).length
                    }{" "}
                    kegiatan yang disetujui
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {takData
                      .filter((activity) => activity.approved_status === "Y")
                      .sort((a, b) => b.point - a.point)
                      .map((activity, index) => (
                        <div key={index} className="mb-3">
                          <div className="font-medium">
                            {activity.nama_kegiatan}
                          </div>
                          <div className="text-sm text-muted-foreground flex justify-between">
                            <span>
                              {activity.nama_kategori} - {activity.partisipasi}
                            </span>
                            <span>{activity.point} poin</span>
                          </div>
                          {index <
                            takData.filter(
                              (activity) => activity.approved_status === "Y"
                            ).length -
                              1 && <Separator className="my-2" />}
                        </div>
                      ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Alert className="mt-8">
            <AlertTitle>Catatan Penting</AlertTitle>
            <AlertDescription>
              Perhitungan ini berdasarkan kategorisasi yang diberikan. Untuk
              verifikasi resmi, silakan konsultasikan dengan pihak kampus.
            </AlertDescription>
          </Alert>
        </>
      )}
    </main>
  );
}
