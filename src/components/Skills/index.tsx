"use client"
import { useState } from 'react';
import {
	Badge,
} from '@/components/ui/badge';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle, X } from 'lucide-react';

const IconButton = ({
	onClick,
	children,
}: {
	onClick: () => void;
	children: React.ReactNode;
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className="p-2 rounded-full hover:bg-gray-200 transition-colors"
		>
			{children}
		</button>
	);
};
const CreateJobPostingStep2 = ({ handlePrevious, handleNext, setSelectedSkills, selectedSkills }: any) => {
	const [searchTerm, setSearchTerm] = useState('');

	const sampleSkills = [
		'Adobe After Effects',
		'Video Post-Editing',
		'Adobe Premiere Pro',
		'Video Editing',
		'Adobe Photoshop',
		'Motion Graphics',
		'Graphic Design',
		'Video Production',
		'2D Animation',
		'Animation',
		'WordPress',
		'Education',
		'Video Intro & Outro',
		'Web Design',
		'Adobe Illustrator',
		'Content Writing',
		'Video Commercial',
		'Audio Editing',
		'Explainer Video',
		'Final Cut Pro',
		'Maxon Cinema 4D',
		'Documentary',
		'Movie',
		'Music Video',
		'Photo Slideshow',
		'Testimonial Video',
		'Node js',
		'React js',
		'MongoDB',
		'API'
	];

	const filteredSkills = sampleSkills.filter((skill) =>
		skill.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleAddSkill = (skill: string) => {
		if (!selectedSkills.includes(skill)) {
			setSelectedSkills([...selectedSkills, skill]);
		}
	};

	const handleRemoveSkill = (skill: string) => {
		setSelectedSkills(selectedSkills.filter((s: any) => s !== skill));
	};

	return (
		<>
			<Card className="w-full max-w-4xl">
				<CardHeader>
					<CardTitle>Step 2: Required Skills</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-6">
						<Input
							placeholder="Search skills"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{filteredSkills.map((skill) => (
							<div key={skill} className="flex items-center justify-between">
								<span>{skill}</span>
								{selectedSkills.includes(skill) ? (
									<IconButton onClick={() => handleRemoveSkill(skill)}>
										<X className="w-5 h-5" />
									</IconButton>
								) : (
									<IconButton onClick={() => handleAddSkill(skill)}>
										<PlusCircle className="w-5 h-5" />
									</IconButton>
								)}
							</div>
						))}
					</div>
					<div className="mt-6 flex items-center flex-wrap gap-2">
						{selectedSkills.map((skill: any) => (
							<Badge key={skill} variant="outline">
								{skill}
								<IconButton
									onClick={() => handleRemoveSkill(skill)}
									className="ml-2"
								>
									<X className="w-4 h-4" />
								</IconButton>
							</Badge>
						))}
					</div>
				</CardContent>


			</Card>
			<div className="flex justify-between mt-6">
				<button
					type="button"
					className="px-6 py-2 border rounded-lg hover:bg-gray-50"
					onClick={handlePrevious}
				>
					Previous
				</button>
				<button
					type="button"
					className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					onClick={handleNext}
				>
					Next
				</button>
			</div>
		</>
	);
};

export default CreateJobPostingStep2;
