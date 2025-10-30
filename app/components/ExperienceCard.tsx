import Link from 'next/link';
import Image from 'next/image';
import { Experience } from "../lib/api";

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="bg-[#F0F0F0] rounded-lg overflow-hidden">
      <div className="relative h-42 w-full">
        <Image
          src={experience.image || ''}
          alt={experience.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#161616]">
            {experience.title}
          </h3>
          <span className="px-2 py-0.5 bg-[#D6D6D6] text-sm text-[#161616] rounded font-medium">
            {experience.location}
          </span>
        </div>

        <p className="text-sm text-[#6C6C6C] mb-4 line-clamp-2">
          {experience.description}
        </p>

        <div className="flex items-center justify-between">
          <div className='flex gap-1.5'>
            <span className="text-sm text-[#161616] mt-2">From </span>
            <span className="text-2xl font-medium text-gray-900">
              ₹{experience.price}
            </span>
          </div>
          <Link
            href={`/experiences/${experience._id}`}
            className="px-4 py-2 bg-[#FFD643] text-[#161616] text-sm font-medium rounded hover:bg-yellow-500 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}