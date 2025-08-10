import { CourseStructurer } from '@/components/course-structurer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary-foreground">
              Course Structurer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Instantly convert YouTube course timestamps into a structured project directory, ready for you to start coding.
          </p>
        </header>
        <CourseStructurer />
      </div>
    </main>
  );
}
